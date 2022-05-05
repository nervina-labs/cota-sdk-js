const { addressToScript, serializeScript } = require('@nervosnetwork/ckb-sdk-utils')
const { Collector, Aggregator, generateMintCotaTx, FEE } = require('@nervina-labs/cota-sdk')

// AliceMainnet
const TEST_PRIVATE_KEY = '0x-example'
const TEST_ADDRESS = 'ckb1qyqxx0xdw7g67eu35nuj0f237eg8skpdctuqwx39xm'
const RECEIVER_ADDRESS = 'ckb1qyqxx0xdw7g67eu35nuj0f237eg8skpdctuqwx39xm'

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
  const mintLock = addressToScript(TEST_ADDRESS)

  // If any tokenIndex of MintCotaInfo is not set, the tokenIndex will be set automatically with issued count.
  const mintCotaInfo = {
    cotaId: '0xae223946058e5b148045d11483df60b36dc28a30',
    withdrawals: [
      {
        // tokenIndex: '0x00000000',
        state: '0x00',
        characteristic: '0x0505050505050505050505050505050505050505',
        toLockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
      },
      {
        // tokenIndex: '0x00000001',
        state: '0x00',
        characteristic: '0x0505050505050505050505050505050505050505',
        toLockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
      },
    ],
  }

  let rawTx = await generateMintCotaTx(service, mintLock, mintCotaInfo, FEE, isMainnet)
  rawTx.cellDeps.push(secp256k1CellDep(isMainnet))

  const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Mint cota nft tx has been sent with tx hash ${txHash}`)
}

run()
