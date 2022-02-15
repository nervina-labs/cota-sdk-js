import { scriptToHash, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { ClaimReq, Service, Claim } from '../..'
import { FEE, TestnetDeployment } from '../../constants'

export const claimCotaNFT = async (
  service: Service, 
  cotaLock: CKBComponents.Script, 
  withdrawalLock: CKBComponents.Script,
  claims: Claim[],
  fee = FEE
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

  const withdrawalLockHash = scriptToHash(withdrawalLock)
  const withdrawalCotaCells = await service.collector.getCells(withdrawalLock, cotaType)
   if (!withdrawalCotaCells || withdrawalCotaCells.length === 0) {
    throw new Error("Withdrawal cota cell doesn't exist")
  }
  const withdrawalCotaCell = withdrawalCotaCells[0]

  const claimReq: ClaimReq = {
    lockScript: serializeScript(cotaLock),
    withdrawalLockHash,
    claims: claims,
  }

  const { smtRootHash, claimSmtEntry } = await service.aggregator.generateClaimCotaSmt(claimReq)
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
    i > 0 ? '0x' : { lock: '', inputType: `0x04${claimSmtEntry}`, outputType: '' },
  )
  return rawTx
}
