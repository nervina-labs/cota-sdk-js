import axios from 'axios'
import CKB from '@nervosnetwork/ckb-sdk-core'
import { toCamelcase } from '../utils/case-parser'
import { IndexerCell, CollectResult } from '../types/collector'
import { MIN_CAPACITY } from '../constants'

export class Collector {
  private ckbNodeUrl: string
  private ckbIndexerUrl: string

  constructor({ ckbNodeUrl, ckbIndexerUrl }: { ckbNodeUrl: string; ckbIndexerUrl: string }) {
    this.ckbNodeUrl = ckbNodeUrl
    this.ckbIndexerUrl = ckbIndexerUrl
  }

  getCkb() {
    return new CKB(this.ckbNodeUrl)
  }

  async getCells(lock: CKBComponents.Script, type?: CKBComponents.Script): Promise<IndexerCell[] | undefined> {
    const filter = type
      ? {
          script: {
            code_hash: type.codeHash,
            hash_type: type.hashType,
            args: type.args,
          },
        }
      : {
          script: null,
          output_data_len_range: ['0x0', '0x1'],
        }
    let payload = {
      id: 1,
      jsonrpc: '2.0',
      method: 'get_cells',
      params: [
        {
          script: {
            code_hash: lock.codeHash,
            hash_type: lock.hashType,
            args: lock.args,
          },
          script_type: 'lock',
          filter,
        },
        'asc',
        '0x64',
      ],
    }
    const body = JSON.stringify(payload, null, '  ')
    let response = (
      await axios({
        method: 'post',
        url: this.ckbIndexerUrl,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 3000000,
        data: body,
      })
    ).data
    if (response.error) {
      console.error(response.error)
      throw Error('Get cells error')
    } else {
      return toCamelcase(response.result.objects)
    }
  }

  async collectInputs(liveCells: IndexerCell[], needCapacity: bigint, fee: bigint): Promise<CollectResult> {
    let inputs: CKBComponents.CellInput[] = []
    let sum = BigInt(0)
    for (let cell of liveCells) {
      inputs.push({
        previousOutput: {
          txHash: cell.outPoint.txHash,
          index: cell.outPoint.index,
        },
        since: '0x0',
      })
      sum = sum + BigInt(cell.output.capacity)
      if (sum >= needCapacity + MIN_CAPACITY + fee) {
        break
      }
    }
    if (sum < needCapacity + fee) {
      throw Error('Capacity not enough')
    }
    if (sum < needCapacity + MIN_CAPACITY + fee) {
      throw Error('Capacity not enough for change')
    }
    return { inputs, capacity: sum }
  }

  async getLiveCell(outPoint: CKBComponents.OutPoint): Promise<CKBComponents.LiveCell> {
    const ckb = new CKB(this.ckbNodeUrl)
    const { cell } = await ckb.rpc.getLiveCell(outPoint, true)
    return cell
  }
}
