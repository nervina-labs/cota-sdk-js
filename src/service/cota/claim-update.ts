import { scriptToHash, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { Service, CotaNft, ClaimUpdateReq } from '../..'
import { FEE, getCotaTypeScript, getCotaCellDep } from '../../constants'

export const generateClaimUpdateCotaTx = async (
  service: Service,
  cotaLock: CKBComponents.Script,
  withdrawalLock: CKBComponents.Script,
  nfts: CotaNft[],
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

  const withdrawalLockHash = scriptToHash(withdrawalLock)
  const withdrawalCotaCells = await service.collector.getCells(withdrawalLock, cotaType)
  if (!withdrawalCotaCells || withdrawalCotaCells.length === 0) {
    throw new Error("Withdrawal cota cell doesn't exist")
  }
  const withdrawalCotaCell = withdrawalCotaCells[0]

  const claimUpdateReq: ClaimUpdateReq = {
    lockScript: serializeScript(cotaLock),
    withdrawalLockHash,
    nfts,
  }

  const { smtRootHash, claimUpdateSmtEntry } = await service.aggregator.generateClaimUpdateCotaSmt(claimUpdateReq)
  const outputsData = [`0x00${smtRootHash}`]

  const withdrawalCellDep: CKBComponents.CellDep = { outPoint: withdrawalCotaCell.outPoint, depType: 'code' }
  const cellDeps = [withdrawalCellDep, getCotaCellDep(isMainnet)]

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
    i > 0 ? '0x' : { lock: '', inputType: `0x07${claimUpdateSmtEntry}`, outputType: '' },
  )
  return rawTx
}
