const { addressToScript, serializeScript } = require('@nervosnetwork/ckb-sdk-utils')
const { Collector, Aggregator, generateTransferCotaTx, FEE } = require('@nervina-labs/cota-sdk')

const TEST_ADDRESS = 'ckb1qyqxx0xdw7g67eu35nuj0f237eg8skpdctuqwx39xm'
const RECEIVER_PRIVATE_KEY = '0x65e4b4dc59d93349f0ceb3926ffcb8338808a54afe51338292ea6baa3784619f'
const RECEIVER_ADDRESS = 'ckb1qyqxx0xdw7g67eu35nuj0f237eg8skpdctuqwx39xm'
const OTHER_ADDRESS = 'ckb1qyq0xt2728kgl0pfvqgvul92209z7vkxwezsmqz650'

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
  const cotaLock = addressToScript(RECEIVER_ADDRESS)
  const withdrawLock = addressToScript(TEST_ADDRESS)

  const transfers = [
    {
      cotaId: '0xc4a5cbf26b597acf3b35c74f61931c33aa16a55e',
      tokenIndex: '0x00000008',
      toLockScript: serializeScript(addressToScript(OTHER_ADDRESS)),
    },
  ]
  let rawTx = await generateTransferCotaTx(service, cotaLock, withdrawLock, transfers, FEE, isMainnet)
  rawTx.cellDeps.push(secp256k1CellDep(isMainnet))

  console.log(JSON.stringify(rawTx))

  const signedTx = ckb.signTransaction(RECEIVER_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  const result = await ckb.rpc.dryRunTransaction(signedTx)
  console.log(JSON.stringify(result))
  // let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  // console.info(`Transfer cota nft tx has been sent with tx hash ${txHash}`)
}

run()
