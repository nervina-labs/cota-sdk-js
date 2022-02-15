import { scriptToHash, serializeOutPoint, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { Service, TransferReq, TransferWithdrawal } from '../..'
import { FEE, TestnetDeployment } from '../../constants'
import { append0x } from '../../utils/hex'

export const transferCotaNFT = async (
  service: Service,
  cotaLock: CKBComponents.Script,
  withdrawalLock: CKBComponents.Script,
  transfers: TransferWithdrawal[],
  fee = FEE,
) => {
  const cotaType = TestnetDeployment.CotaTypeScript
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

  const cotaLockScript = serializeScript(withdrawalLock)
  const withdrawalLockHash = scriptToHash(cotaLock)
  const withdrawalCotaCells = await service.collector.getCells(withdrawalLock, cotaType)
  if (!withdrawalCotaCells || withdrawalCotaCells.length === 0) {
    throw new Error("Withdrawal cota cell doesn't exist")
  }
  const withdrawalCotaCell = withdrawalCotaCells[0]

  const transferReq: TransferReq = {
    lockScript: cotaLockScript,
    withdrawalLockHash,
    transferOutPoint: append0x(serializeOutPoint(cotaCell.outPoint).slice(26)),
    transfers,
  }
  const { smtRootHash, transferSmtEntry } = await service.aggregator.generateTransferCotaSmt(transferReq)
  const outputsData = [`0x00${smtRootHash}`]

  const withdrawalCellDep: CKBComponents.CellDep = { outPoint: withdrawalCotaCell.outPoint, depType: 'code' }
  const cellDeps = [withdrawalCellDep, TestnetDeployment.CotaTypeDep]
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
    i > 0 ? '0x' : { lock: '', inputType: `0x06${transferSmtEntry}`, outputType: '' },
  )
  return rawTx
}
