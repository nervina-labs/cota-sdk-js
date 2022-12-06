const {
  addressToScript,
  rawTransactionToHash,
  scriptToHash,
  serializeWitnessArgs,
} = require('@nervosnetwork/ckb-sdk-utils')
const { Collector, Aggregator, getAlwaysSuccessLock, generateRegisterCotaTx, FEE } = require('@nervina-labs/cota-sdk')

// AliceMainnet
const TEST_PRIVATE_KEY = '0x65e4b4dc59d93349f0ceb3926ffcb8338808a54afe51338292ea6baa3784619f'
const TEST_ADDRESS = 'ckb1qyqxx0xdw7g67eu35nuj0f237eg8skpdctuqwx39xm'

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
  const isMainnet = true

  const service = {
    collector: new Collector({
      ckbNodeUrl: 'https://mainnet.ckb.dev/rpc',
      ckbIndexerUrl: 'https://mainnet.ckb.dev/indexer',
    }),
    aggregator: new Aggregator({
      registryUrl: 'https://cota.nervina.dev/mainnet-registry-aggregator',
      cotaUrl: 'https://cota.nervina.dev/mainnet-aggregator',
    }),
  }
  const ckb = service.collector.getCkb()
  const provideCKBLock = addressToScript(TEST_ADDRESS)
  const unregisteredCotaLock = addressToScript(
    'ckb1qzl58smqy32hnrq6vxjedcxe2fugvnz497h7yvwqvwel40uh4rltcqdjejyul32m2jmnu86w4esltzkg5k3ej3gpwhzrx',
  )

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

  const signedWitnesses = ckb.signWitnesses(keyMap)({
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
  // let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  // console.log(`Register cota cell tx has been sent with tx hash ${txHash}`)
}

run()
