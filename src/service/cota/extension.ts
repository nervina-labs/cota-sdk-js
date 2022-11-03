import { serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { Service } from '../..'
import { FEE, getCotaTypeScript, getCotaCellDep } from '../../constants'
import { ExtensionReq } from '../../types'


enum Action {
  Add,
  Update
}

const generateExtensionTx = async (
  service: Service,
  cotaLock: CKBComponents.Script,
  fee = FEE,
  isMainnet = false,
  action: Action,
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

  const extensionReq: ExtensionReq = {
    lockScript: serializeScript(cotaLock),
  }

  const { smtRootHash, extensionSmtEntry } = await service.aggregator.generateExtensionSmt(extensionReq)
  const cotaCellData = `0x02${smtRootHash}`

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
  } as any

  const prefix = action == Action.Add ? '0xF0' : '0xF1'
  rawTx.witnesses = rawTx.inputs.map((_, i) =>
    i > 0 ? '0x' : { lock: '', inputType: `${prefix}${extensionSmtEntry}`, outputType: '' },
  )
  return rawTx
}


export const generateAddExtensionTx = async (
  service: Service,
  cotaLock: CKBComponents.Script,
  fee = FEE,
  isMainnet = false
) => await generateExtensionTx(service, cotaLock, fee, isMainnet, Action.Add)


  export const generateUpdateExtensionTx = async (
  service: Service,
  cotaLock: CKBComponents.Script,
  fee = FEE,
  isMainnet = false
) => await generateExtensionTx(service, cotaLock, fee, isMainnet, Action.Update)