import { addressToScript, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { Collector } from '../src/collector'
import { Aggregator } from '../src/aggregator'
import { generateWithdrawCotaTx } from '../src/service/cota'
import { Service, TransferWithdrawal, FEE } from '../src'

const TEST_ADDRESS = 'ckt1qyqp8ydxwz3p4vcmjwc2d7zqk4xhv707j80q4yrap2'
const RECEIVER_PRIVATE_KEY = '0xb9449dc7e16f89bc2840f2e4c8a2fbbbd71f56aeca7f6e8d34d8b31192e5f93f'
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
  const withdrawLock = addressToScript(RECEIVER_ADDRESS)
  const toLock = addressToScript(TEST_ADDRESS)

  const withdrawals: TransferWithdrawal[] = [
    {
      cotaId: '0x003688bb1cba009d89dd3f1c8a6027a0c5851e86',
      tokenIndex: '0x00000000',
      toLockScript: serializeScript(toLock),
    },
  ]

  let rawTx = await generateWithdrawCotaTx(service, withdrawLock, withdrawals, FEE, isMainnet)
  rawTx.cellDeps.push(secp256k1CellDep(isMainnet))

  const signedTx = ckb.signTransaction(RECEIVER_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Withdraw cota nft tx has been sent with tx hash ${txHash}`)
}

run()
