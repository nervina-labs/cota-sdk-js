import {
  addressToScript,
  rawTransactionToHash,
  scriptToHash,
  serializeOutPoint,
  serializeScript,
} from '@nervosnetwork/ckb-sdk-utils'
import { Collector } from '../src/collector'
import { Aggregator } from '../src/aggregator'
import {
  Service,
  FEE,
  getCotaTypeScript,
  SequentialTransferReq,
  SequentialTransfer,
  append0x,
  getCotaCellDep,
} from '../src'

const TEST_ADDRESS = 'ckt1qyqp8ydxwz3p4vcmjwc2d7zqk4xhv707j80q4yrap2'
const RECEIVER_PRIVATE_KEY = '0xb9449dc7e16f89bc2840f2e4c8a2fbbbd71f56aeca7f6e8d34d8b31192e5f93f'
const RECEIVER_ADDRESS = 'ckt1qyqdvq39qrxcw6hpl0lp07y0qu2659ml7h5sfz8s6a'
const OTHER_ADDRESS = 'ckt1qyqz8vxeyrv4nur4j27ktp34fmwnua9wuyqqggd748'

const secp256k1CellDep = (isMainnet: boolean): CKBComponents.CellDep => {
  if (isMainnet) {
    return {
      outPoint: {
        txHash: '0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c',
        index: '0x0',
      },
      depType: 'depGroup',
    }
  }
  return {
    outPoint: {
      txHash: '0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37',
      index: '0x0',
    },
    depType: 'depGroup',
  }
}

const service: Service = {
  collector: new Collector({
    ckbNodeUrl: 'https://testnet.ckbapp.dev/rpc',
    ckbIndexerUrl: 'https://testnet.ckbapp.dev/rpc',
  }),
  aggregator: new Aggregator({
    registryUrl: 'https://cota.nervina.dev/registry-aggregator',
    cotaUrl: 'http://localhost:3030',
  }),
}
const isMainnet = false

const ckb = service.collector.getCkb()
const cotaLock = addressToScript(RECEIVER_ADDRESS)
const withdrawLock = addressToScript(TEST_ADDRESS)
const cotaLockScript = serializeScript(cotaLock)
const withdrawalLockHash = scriptToHash(withdrawLock)

const cotaType = getCotaTypeScript(isMainnet)
const cellDeps = [getCotaCellDep(isMainnet), secp256k1CellDep(isMainnet)]

const generateFirstTx = async () => {
  const cotaCells = await service.collector.getCells(cotaLock, cotaType)
  if (!cotaCells || cotaCells.length === 0) {
    throw new Error("Cota cell doesn't exist")
  }
  const cotaCell = cotaCells[0]

  const inputs1 = [
    {
      previousOutput: cotaCell.outPoint,
      since: '0x0',
    },
  ]
  const outputs1 = [cotaCell.output]
  outputs1[0].capacity = `0x${(BigInt(outputs1[0].capacity) - FEE).toString(16)}`

  let transfers: SequentialTransfer[] = [
    {
      withdrawalLockHash,
      transferOutPoint: append0x(serializeOutPoint(cotaCell.outPoint).slice(26)),
      cotaId: '0x003688bb1cba009d89dd3f1c8a6027a0c5851e86',
      tokenIndex: '0x00000027',
      toLockScript: serializeScript(addressToScript(OTHER_ADDRESS)),
    },
  ]
  const transferReq1: SequentialTransferReq = {
    lockScript: cotaLockScript,
    transfers,
  }
  const resp1 = await service.aggregator.generateSequentialTransferCotaSmt(transferReq1)
  const outputsData1 = [`0x02${resp1.smtRootHash}`]

  const headerDeps1 = [`0x${resp1.withdrawBlockHash}`]

  const rawTx1: CKBComponents.RawTransaction = {
    version: '0x0',
    cellDeps,
    headerDeps: headerDeps1,
    inputs: inputs1,
    outputs: outputs1,
    outputsData: outputsData1,
    witnesses: [],
  }
  const poolTxHash = rawTransactionToHash(rawTx1)
  console.info(`First transfer in the pool tx hash: ${poolTxHash}`)
  // @ts-ignore
  rawTx1.witnesses = rawTx1.inputs.map((_, i) =>
    i > 0 ? '0x' : { lock: '', inputType: `0x06${resp1.transferSmtEntry}`, outputType: '' },
  )
  return { poolTxHash, transfers, signedTx: ckb.signTransaction(RECEIVER_PRIVATE_KEY)(rawTx1) }
}

const generateSecondTx = async (poolTxHash: string, transfers: SequentialTransfer[]) => {
  const cotaCells = await service.collector.getCells(cotaLock, cotaType)
  if (!cotaCells || cotaCells.length === 0) {
    throw new Error("Cota cell doesn't exist")
  }
  const cotaCell = cotaCells[0]
  const inputs2 = [
    {
      previousOutput: {
        txHash: poolTxHash,
        index: '0x0',
      },
      since: '0x0',
    },
  ]
  const outputs2 = [cotaCell.output]
  outputs2[0].capacity = `0x${(BigInt(outputs2[0].capacity) - FEE - FEE).toString(16)}`

  transfers.push({
    withdrawalLockHash,
    transferOutPoint: append0x(serializeOutPoint(inputs2[0].previousOutput).slice(26)),
    cotaId: '0x003688bb1cba009d89dd3f1c8a6027a0c5851e86',
    tokenIndex: '0x00000028',
    toLockScript: serializeScript(addressToScript(OTHER_ADDRESS)),
  })

  const transferReq2 = {
    lockScript: cotaLockScript,
    transfers,
  }
  const resp2 = await service.aggregator.generateSequentialTransferCotaSmt(transferReq2)
  const outputsData2 = [`0x02${resp2.smtRootHash}`]

  const headerDeps2 = [`0x${resp2.withdrawBlockHash}`]

  const rawTx2: CKBComponents.RawTransaction = {
    version: '0x0',
    cellDeps,
    headerDeps: headerDeps2,
    inputs: inputs2,
    outputs: outputs2,
    outputsData: outputsData2,
    witnesses: [],
  }
  // @ts-ignore
  rawTx2.witnesses = rawTx2.inputs.map((_, i) =>
    i > 0 ? '0x' : { lock: '', inputType: `0x06${resp2.transferSmtEntry}`, outputType: '' },
  )
  return ckb.signTransaction(RECEIVER_PRIVATE_KEY)(rawTx2)
}

const run = async () => {
  const { poolTxHash, transfers, signedTx } = await generateFirstTx()
  const txHash1 = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`First NFT transfer on the chain tx hash: ${txHash1}`)

  setTimeout(async () => {
    const signedTx2 = await generateSecondTx(poolTxHash, transfers)
    const txHash2 = await ckb.rpc.sendTransaction(signedTx2, 'passthrough')
    console.info(`Second NFT transfer on the chain tx hash: ${txHash2}`)
  }, 1000)
}

run()
