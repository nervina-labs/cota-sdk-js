import { scriptToHash } from '@nervosnetwork/ckb-sdk-utils'
import { CotaNft, Service, UpdateReq } from '../..'
import { FEE, getCotaTypeScript, getCotaCellDep } from '../../constants'

export const generateUpdateCotaTx = async (
  service: Service,
  cotaLock: CKBComponents.Script,
  cotaNfts: CotaNft[],
  fee = FEE,
  isMainnet = false,
) => {
  const cotaType = getCotaTypeScript(isMainnet)
  const cotaCells = await service.collector.getCells(cotaLock, cotaType)
  if (!cotaCells || cotaCells.length === 0) {
    throw new Error("Cota cell doesn't exist")
  }
  const cotaCell = cotaCells[0]
  const inputs = [
    {
      previousOutput: cotaCell.outPoint,
      since: '0x0',
    },
  ]
  const outputs = [cotaCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - fee).toString(16)}`
  const updateReq: UpdateReq = {
    lockHash: scriptToHash(cotaLock),
    nfts: cotaNfts,
  }
  const { smtRootHash, updateSmtEntry } = await service.aggregator.generateUpdateCotaSmt(updateReq)
  const outputsData = [`0x00${smtRootHash}`]
  const cellDeps = [getCotaCellDep(isMainnet)]
  const rawTx = {
    version: '0x0',
    cellDeps,
    headerDeps: [],
    inputs,
    outputs,
    outputsData,
    witnesses: [],
  }
  rawTx.witnesses = rawTx.inputs.map((_, i) =>
    i > 0 ? '0x' : { lock: '', inputType: `0x05${updateSmtEntry}`, outputType: '' },
  )
  return rawTx
}
