import { hexToBytes, PERSONAL, serializeInput, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import blake2b from '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b'
import { Byte, Service, DefineReq } from '../..'
import { FEE, getCotaTypeScript, getCotaCellDep } from '../../constants'
import { CotaInfo, Hex } from '../../types'
import { u8ToHex, u32ToBe, append0x, utf8ToHex, toSnakeCase } from '../../utils'

const generateCotaMetadata = (cotaInfo: CotaInfo, cotaId: Hex): Hex => {
  const cotaInfoTemp = {
    cotaId,
    ...cotaInfo,
  }
  const cotaMeta = {
    id: 'CTMeta',
    ver: '1.0',
    metadata: {
      target: 'output#0',
      type: 'cota',
      data: {
        version: '0',
        ...cotaInfoTemp,
      },
    },
  }
  return append0x(utf8ToHex(JSON.stringify(toSnakeCase(cotaMeta))))
}

const generateCotaId = (firstInput: CKBComponents.CellInput, definesIndex: number) => {
  const input = hexToBytes(serializeInput(firstInput))
  const s = blake2b(32, null, null, PERSONAL)
  s.update(input)
  s.update(hexToBytes(`0x${u8ToHex(definesIndex)}`))
  return `0x${s.digest('hex').slice(0, 40)}`
}

export const generateDefineCotaTx = async (
  service: Service,
  cotaLock: CKBComponents.Script,
  total: number,
  confiure: Byte,
  cotaInfo: CotaInfo,
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

  const cotaId = generateCotaId(inputs[0], 0)

  const defineReq: DefineReq = {
    lockScript: serializeScript(cotaLock),
    cotaId,
    total: append0x(u32ToBe(total)),
    issued: '0x00000000',
    configure: append0x(confiure),
  }

  const { smtRootHash, defineSmtEntry } = await service.aggregator.generateDefineCotaSmt(defineReq)
  const cotaCellData = `0x01${smtRootHash}`

  const outputsData = [cotaCellData]
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
    i > 0 ? '' : { lock: '', inputType: `0x01${defineSmtEntry}`, outputType: generateCotaMetadata(cotaInfo, cotaId) },
  )
  return { rawTx, cotaId }
}
