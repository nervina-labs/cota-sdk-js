import { serializeOutPoint, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { Service, TransferWithdrawal, WithdrawalReq } from '../../types'
import { FEE, getCotaTypeScript, getCotaCellDep } from '../../constants'
import { append0x } from '../../utils'

export const generateWithdrawCotaTx = async (
  service: Service,
  cotaLock: CKBComponents.Script,
  withdrawals: TransferWithdrawal[],
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

  const withdrawalReq: WithdrawalReq = {
    lockScript: serializeScript(cotaLock),
    outPoint: append0x(serializeOutPoint(cotaCell.outPoint).slice(26)),
    withdrawals: withdrawals,
  }
  const { smtRootHash, withdrawalSmtEntry } = await service.aggregator.generateWithdrawalCotaSmt(withdrawalReq)
  const outputsData = [`0x01${smtRootHash}`]
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
    i > 0 ? '0x' : { lock: '', inputType: `0x03${withdrawalSmtEntry}`, outputType: '' },
  )
  return rawTx
}
