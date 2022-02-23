const {
  addressToScript,
  rawTransactionToHash,
  scriptToHash,
  serializeWitnessArgs,
} = require('@nervosnetwork/ckb-sdk-utils')
const { Collector } = require('../lib/collector')
const { Aggregator } = require('../lib/aggregator')
const { getAlwaysSuccessLock } = require('../lib/constants')
const { generateRegisterCotaTx } = require('../lib/service/registry')
const signWitnesses = require('@nervosnetwork/ckb-sdk-core/lib/signWitnesses')

const TEST_PRIVATE_KEY = '0xc5bd09c9b954559c70a77d68bde95369e2ce910556ddc20f739080cde3b62ef2'
const TEST_ADDRESS = 'ckt1qyq0scej4vn0uka238m63azcel7cmcme7f2sxj5ska'

const secp256k1CellDep = async ckb => {
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  return { outPoint: secp256k1Dep.outPoint, depType: 'depGroup' }
}

const run = async () => {
  const service = {
    collector: new Collector({ ckbNodeUrl: 'http://localhost:8114', ckbIndexerUrl: 'http://localhost:8116' }),
    aggregator: new Aggregator({ registryUrl: 'http://localhost:3050', cotaUrl: 'http://localhost:3030' }),
  }
  const ckb = service.collector.getCkb()
  const provideCKBLock = addressToScript(TEST_ADDRESS)
  const unregisteredCotaLock = addressToScript(TEST_ADDRESS)
  let rawTx = await generateRegisterCotaTx(service, [unregisteredCotaLock], provideCKBLock)
  const secp256k1Dep = await secp256k1CellDep(ckb)
  rawTx.cellDeps.push(secp256k1Dep)

  const registryLock = getAlwaysSuccessLock(false)

  let keyMap = new Map()
  keyMap.set(scriptToHash(registryLock), '')
  keyMap.set(scriptToHash(provideCKBLock), TEST_PRIVATE_KEY)

  const cells = rawTx.inputs.map((input, index) => ({
    outPoint: input.previousOutput,
    lock: index === 0 ? registryLock : provideCKBLock,
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
  console.log(`Register cota cell tx has been sent with tx hash ${txHash}`)
}

run()
