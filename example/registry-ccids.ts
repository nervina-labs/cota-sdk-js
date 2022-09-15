import { rawTransactionToHash, scriptToHash, serializeWitnessArgs } from '@nervosnetwork/ckb-sdk-utils'
import { Collector } from '../src/collector'
import { Aggregator } from '../src/aggregator'
import { getAlwaysSuccessLock } from '../src/constants'
import { generateUpdateCcidsTx } from '../src/service/registry'
import { Service } from '../src'
import signWitnesses from '@nervosnetwork/ckb-sdk-core/lib/signWitnesses'


const run = async () => {
  // True for mainnet and false for testnet
  const isMainnet = false

  const service: Service = {
    collector: new Collector({ ckbNodeUrl: 'https://testnet.ckb.dev/rpc', ckbIndexerUrl: 'https://testnet.ckb.dev/indexer' }),
    aggregator: new Aggregator({ registryUrl: 'http://localhost:3050', cotaUrl: 'http://localhost:3030' }),
  }
  const ckb = service.collector.getCkb()

  let rawTx = await generateUpdateCcidsTx(service, isMainnet)

  const registryLock = getAlwaysSuccessLock(isMainnet)

  let keyMap = new Map<string, string>()
  keyMap.set(scriptToHash(registryLock), '')

  const cells = rawTx.inputs.map((input, _) => ({
    outPoint: input.previousOutput,
    lock: registryLock,
  }))

  const transactionHash = rawTransactionToHash(rawTx)

  const signedWitnesses = signWitnesses(keyMap)({
    transactionHash,
    witnesses: rawTx.witnesses,
    inputCells: cells,
    skipMissingKeys: true,
  })
  const signedTx = {
    ...rawTx,
    witnesses: signedWitnesses.map(witness => (typeof witness === 'string' ? witness : serializeWitnessArgs(witness))),
  }
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.log(`Update registered ccids tx has been sent with tx hash ${txHash}`)
}

run()
