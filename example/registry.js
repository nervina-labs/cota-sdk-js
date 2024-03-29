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

const secp256k1CellDep = isMainnet => {
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

const run = async () => {
  // True for mainnet and false for testnet
  const isMainnet = false

  const service = {
    collector: new Collector({
      ckbNodeUrl: 'https://testnet.ckbapp.dev/rpc',
      ckbIndexerUrl: 'https://testnet.ckbapp.dev/indexer',
    }),
    aggregator: new Aggregator({
      registryUrl: 'https://cota.nervina.dev/registry-aggregator',
      cotaUrl: 'http://localhost:3030',
    }),
  }
  const ckb = service.collector.getCkb()
  const provideCKBLock = addressToScript(TEST_ADDRESS)
  const unregisteredCotaLock = addressToScript(TEST_ADDRESS)

  let rawTx = await generateRegisterCotaTx(service, [unregisteredCotaLock], provideCKBLock, FEE, isMainnet)
  rawTx.cellDeps.push(secp256k1CellDep(isMainnet))

  const registryLock = getAlwaysSuccessLock(isMainnet)

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
