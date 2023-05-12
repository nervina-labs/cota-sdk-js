import { addressToScript, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { Collector } from '../src/collector'
import { Aggregator } from '../src/aggregator'
import { generateMintCotaTx } from '../src/service/cota'
import { MintCotaInfo, Service, FEE } from '../src'

const TEST_PRIVATE_KEY = '0x59df3d4584579a4b8ae77e4d7a851d68178a0e19dbbdd53b5daab543943e1b31'
const TEST_ADDRESS = 'ckt1qyqp8ydxwz3p4vcmjwc2d7zqk4xhv707j80q4yrap2'
const RECEIVER_ADDRESS = 'ckt1qyqdvq39qrxcw6hpl0lp07y0qu2659ml7h5sfz8s6a'

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

const run = async () => {
  // True for mainnet and false for testnet
  const isMainnet = false

  const service: Service = {
    collector: new Collector({
      ckbNodeUrl: 'https://testnet.ckbapp.dev/rpc',
      ckbIndexerUrl: 'https://testnet.ckbapp.dev/rpc',
    }),
    aggregator: new Aggregator({
      registryUrl: 'https://cota.nervina.dev/registry-aggregator',
      cotaUrl: 'https://cota.nervina.dev/aggregator',
    }),
  }
  const ckb = service.collector.getCkb()
  const mintLock = addressToScript(TEST_ADDRESS)

  // If any tokenIndex of MintCotaInfo is not set, the tokenIndex will be set automatically with issued count.
  const mintCotaInfo: MintCotaInfo = {
    cotaId: '0x003688bb1cba009d89dd3f1c8a6027a0c5851e86',
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
