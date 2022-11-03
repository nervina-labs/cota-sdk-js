import { scriptToHash, serializeWitnessArgs } from '@nervosnetwork/ckb-sdk-utils'
import { Service } from '../..'
import {
  FEE,
  getAlwaysSuccessLock,
  getCotaTypeScript,
  getRegistryTypeScript,
  getAlwaysSuccessCellDep,
  getCotaCellDep,
} from '../../constants'
import { append0x, remove0x, u64ToBe } from '../../utils/hex'

const COTA_CELL_CAPACITY = BigInt(150) * BigInt(100000000)

const generateCotaOutputs = async (
  inputCapacity: bigint,
  cotaLocks: CKBComponents.Script[],
  changeLock: CKBComponents.Script,
  fee: bigint,
  isMainnet: boolean,
): Promise<CKBComponents.CellOutput[]> => {
  let outputs: CKBComponents.CellOutput[] = cotaLocks.map(lock => {
    const args = append0x(remove0x(scriptToHash(lock)).slice(0, 40))
    const cotaType = { ...getCotaTypeScript(isMainnet), args }
    return {
      capacity: `0x${COTA_CELL_CAPACITY.toString(16)}`,
      lock,
      type: cotaType,
    }
  })

  const cotaCellsLength = BigInt(cotaLocks.length)
  const changeCapacity = inputCapacity - fee - COTA_CELL_CAPACITY * cotaCellsLength
  outputs.push({
    capacity: `0x${changeCapacity.toString(16)}`,
    lock: changeLock,
    type: null,
  })
  return outputs
}

export const generateRegisterCotaTx = async (
  service: Service,
  cotaLocks: CKBComponents.Script[],
  lock: CKBComponents.Script,
  fee = FEE,
  isMainnet = false,
): Promise<CKBComponents.RawTransactionToSign> => {
  const cotaCount = BigInt(cotaLocks.length)
  const registryLock = getAlwaysSuccessLock(isMainnet)
  const registryType = getRegistryTypeScript(isMainnet)
  const registryCells = await service.collector.getCells(registryLock, registryType)
  if (!registryCells || registryCells.length === 0) {
    throw new Error("Registry cell doesn't exist")
  }
  let registryCell = registryCells[0]
  const liveCells = await service.collector.getCells(lock)
  const { inputs: normalInputs, capacity } = await service.collector.collectInputs(
    liveCells,
    COTA_CELL_CAPACITY * cotaCount,
    fee,
  )

  let inputs = [
    {
      previousOutput: registryCell.outPoint,
      since: '0x0',
    },
  ]
  inputs = inputs.concat(normalInputs)

  let outputs = await generateCotaOutputs(capacity, cotaLocks, lock, fee, isMainnet)
  outputs = [registryCell.output].concat(outputs)
  const length = outputs.length
  outputs[length - 1].capacity = `0x${(BigInt(outputs[length - 1].capacity) - fee).toString(16)}`

  const lockHashes = cotaLocks.map(lock => scriptToHash(lock))
  const { smtRootHash, registrySmtEntry, outputAccountNum } = await service.aggregator.generateRegisterCotaSmt(
    lockHashes,
  )
  const registryCellData = `0x01${smtRootHash}${u64ToBe(BigInt(outputAccountNum))}`

  const outputsData = outputs.map((_, i) => (i === 0 ? registryCellData : i !== outputs.length - 1 ? '0x02' : '0x'))

  const cellDeps = [getAlwaysSuccessCellDep(isMainnet), getCotaCellDep(isMainnet)]

  let rawTx = {
    version: '0x0',
    cellDeps,
    headerDeps: [],
    inputs,
    outputs,
    outputsData,
    witnesses: [],
  }
  const registryWitness = serializeWitnessArgs({ lock: '', inputType: append0x(registrySmtEntry), outputType: '' })
  const emptyWitness = { lock: '', inputType: '', outputType: '' }
  rawTx.witnesses = rawTx.inputs.map((_, i) => (i === 0 ? registryWitness : i === 1 ? emptyWitness : '0x'))
  return rawTx
}

export const generateUpdateCcidsTx = async (
  service: Service,
  fee = FEE,
  isMainnet = false,
): Promise<CKBComponents.RawTransactionToSign> => {
  const registryLock = getAlwaysSuccessLock(isMainnet)
  const registryType = getRegistryTypeScript(isMainnet)
  const registryCells = await service.collector.getCells(registryLock, registryType)
  if (!registryCells || registryCells.length === 0) {
    throw new Error("Registry cell doesn't exist")
  }
  let registryCell = registryCells[0]
  let inputs = [
    {
      previousOutput: registryCell.outPoint,
      since: '0x0',
    },
  ]

  let outputs = [registryCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - fee).toString(16)}`

  const { smtRootHash, registrySmtEntry, outputAccountNum } = await service.aggregator.generateUpdateCcidsSmt()
  const registryCellData = `0x01${smtRootHash}${u64ToBe(BigInt(outputAccountNum))}`

  const outputsData = [registryCellData]

  const cellDeps = [getAlwaysSuccessCellDep(isMainnet), getCotaCellDep(isMainnet)]
  const registryWitness = serializeWitnessArgs({ lock: '', inputType: append0x(registrySmtEntry), outputType: '' })

  let rawTx = {
    version: '0x0',
    cellDeps,
    headerDeps: [],
    inputs,
    outputs,
    outputsData,
    witnesses: [registryWitness],
  }
  return rawTx
}
