const { addressToScript } = require('@nervosnetwork/ckb-sdk-utils')
const { Collector, Aggregator, generateDefineCotaTx, FEE } = require('@nervina-labs/cota-sdk')

// AliceMainnet
const TEST_PRIVATE_KEY = '0x-example'
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
    collector: new Collector({ ckbNodeUrl: 'http://localhost:8114', ckbIndexerUrl: 'http://localhost:8116' }),
    aggregator: new Aggregator({ registryUrl: 'http://localhost:3050', cotaUrl: 'http://localhost:3030' }),
  }
  const ckb = service.collector.getCkb()
  const defineLock = addressToScript(TEST_ADDRESS)

  const cotaInfo = {
    name: 'CoTA NFT by SDK',
    description: 'The CoTA NFT from CoTA SDK.\n\n-- Which can make the cost reduction.',
    image: 'https://oss.jinse.cc/production/03249d00-6b65-4aac-9147-a6d5d9127542.png',
  }

  const total = 1000

  let { rawTx, cotaId } = await generateDefineCotaTx(service, defineLock, total, '0xc0', cotaInfo, FEE, isMainnet)

  console.log(`cotaId: ${cotaId}`)
  rawTx.cellDeps.push(secp256k1CellDep(isMainnet))

  const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Define cota nft tx has been sent with tx hash ${txHash}`)
}

run()
