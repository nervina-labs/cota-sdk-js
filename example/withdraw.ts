import { addressToScript, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { Collector } from '../src/collector'
import { Aggregator } from '../src/aggregator'
import { generateWithdrawCotaTx } from '../src/service/cota'
import { Service, TransferWithdrawal, FEE } from '../src'
import CKB from '@nervosnetwork/ckb-sdk-core'

const TEST_ADDRESS = 'ckt1qyq0scej4vn0uka238m63azcel7cmcme7f2sxj5ska'
const RECEIVER_PRIVATE_KEY = '0xcf56c11ce3fbec627e5118acd215838d1f9c5048039792d42143f933cde76311'
const RECEIVER_ADDRESS = 'ckt1qyqdcu8n8h5xlhecrd8ut0cf9wer6qnhfqqsnz3lw9'

const secp256k1CellDep = async (ckb: CKB): Promise<CKBComponents.CellDep> => {
  const secp256k1Dep = (await ckb.loadDeps()).secp256k1Dep
  return { outPoint: secp256k1Dep.outPoint, depType: 'depGroup' }
}

const run = async () => {
  const service: Service = {
    collector: new Collector({ ckbNodeUrl: 'http://localhost:8114', ckbIndexerUrl: 'http://localhost:8116' }),
    aggregator: new Aggregator({ registryUrl: 'http://localhost:3050', cotaUrl: 'http://localhost:3030' }),
  }
  const ckb = service.collector.getCkb()
  const withdrawLock = addressToScript(RECEIVER_ADDRESS)
  const toLock = addressToScript(TEST_ADDRESS)

  const withdrawals: TransferWithdrawal[] = [
    {
      cotaId: '0xc27328c95e27723d42770261d05355977aa5c89a',
      tokenIndex: '0x00000000',
      toLockScript: serializeScript(toLock),
    },
  ]

  // Testnet
  let rawTx = await generateWithdrawCotaTx(service, withdrawLock, withdrawals)

  // Mainnet
  // let rawTx = await generateWithdrawCotaTx(service, withdrawLock, withdrawals, FEE, true)

  const secp256k1Dep = await secp256k1CellDep(ckb)
  rawTx.cellDeps.push(secp256k1Dep)

  const signedTx = ckb.signTransaction(RECEIVER_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Withdraw cota nft tx has been sent with tx hash ${txHash}`)
}

run()
