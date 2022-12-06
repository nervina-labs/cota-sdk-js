import { addressToScript, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { Collector } from '../src/collector'
import { Aggregator } from '../src/aggregator'
import { generateTransferCotaTx } from '../src/service/cota'
import { TransferWithdrawal, Service, FEE } from '../src'

const TEST_ADDRESS = 'ckt1qyq0scej4vn0uka238m63azcel7cmcme7f2sxj5ska'
const RECEIVER_PRIVATE_KEY = '0xf0d72b5e3a27e603efb304aa16608ba3e480cb1c6790bced80fb82c53a822cee'
const RECEIVER_ADDRESS = 'ckt1qyqy6xew5q449zg5du7wdjhgrxschjkg3n2q8h5ycc'
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

const run = async () => {
  // True for mainnet and false for testnet
  const isMainnet = false

  const service: Service = {
    collector: new Collector({ ckbNodeUrl: 'http://localhost:8114', ckbIndexerUrl: 'http://localhost:8116' }),
    aggregator: new Aggregator({ registryUrl: 'http://localhost:3050', cotaUrl: 'http://localhost:3030' }),
  }
  const ckb = service.collector.getCkb()
  const cotaLock = addressToScript(RECEIVER_ADDRESS)
  const withdrawLock = addressToScript(TEST_ADDRESS)

  const transfers: TransferWithdrawal[] = [
    {
      cotaId: '0xc27328c95e27723d42770261d05355977aa5c89a',
      tokenIndex: '0x00000013',
      toLockScript: serializeScript(addressToScript(OTHER_ADDRESS)),
    },
  ]
  let rawTx = await generateTransferCotaTx(service, cotaLock, withdrawLock, transfers, FEE, isMainnet)
  rawTx.cellDeps.push(secp256k1CellDep(isMainnet))

  const signedTx = ckb.signTransaction(RECEIVER_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Transfer cota nft tx has been sent with tx hash ${txHash}`)
}

run()
