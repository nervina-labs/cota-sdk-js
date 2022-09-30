import { Service } from '../..'
import { FEE, getCotaTypeScript, getCotaCellDep } from '../../constants'
import { CotaInfo, Hex } from '../../types'
import { append0x, utf8ToHex, toSnakeCase } from '../../utils'

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

export const generateCotaMetadataTx = async (
  service: Service,
  cotaLock: CKBComponents.Script,
  cotaId: Hex,
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

  const cotaOutput = await service.collector.getLiveCell(cotaCell.outPoint)
  const outputsData = [cotaOutput.data?.content]

  const cellDeps = [getCotaCellDep(isMainnet)]

  const rawTx: any = {
    version: '0x0',
    cellDeps,
    headerDeps: [],
    inputs,
    outputs,
    outputsData,
    witnesses: [],
  }
  rawTx.witnesses = rawTx.inputs.map((_, i) =>
    i > 0 ? '0x' : { lock: '', inputType: '', outputType: generateCotaMetadata(cotaInfo, cotaId) },
  )
  return rawTx
}
