import { serializeOutPoint, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { Service, TransferReq, TransferWithdrawal } from '../..'
import { FEE, getCotaTypeScript, getCotaCellDep } from '../../constants'
import { append0x } from '../../utils/hex'

export const generateTransferCotaTx = async (
  service: Service,
  cotaLock: CKBComponents.Script,
  withdrawalLock: CKBComponents.Script,
  transfers: TransferWithdrawal[],
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

  const cotaLockScript = serializeScript(cotaLock)
  const withdrawalLockScript = serializeScript(withdrawalLock)

  const transferReq: TransferReq = {
    lockScript: cotaLockScript,
    withdrawalLockScript,
    transferOutPoint: append0x(serializeOutPoint(cotaCell.outPoint).slice(26)),
    transfers,
  }
  const { smtRootHash, transferSmtEntry, withdrawBlockHash } = await service.aggregator.generateTransferCotaSmt(transferReq)
  const outputsData = [`0x02${smtRootHash}`]

  const cellDeps = [getCotaCellDep(isMainnet)]
  const headerDeps = [`0x${withdrawBlockHash}`]
  
  const rawTx = {
    version: '0x0',
    cellDeps,
    headerDeps,
    inputs,
    outputs,
    outputsData,
    witnesses: [],
  }
  rawTx.witnesses = rawTx.inputs.map((_, i) =>
    i > 0 ? '0x' : { lock: '', inputType: `0x06${transferSmtEntry}`, outputType: '' },
  )
  return rawTx
}
