import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { Collector } from '../src/collector'
import { Aggregator } from '../src/aggregator'
import { generateUpdateCotaTx } from '../src/service/cota'
import { CotaNft, Service, FEE } from '../src'
import CKB from '@nervosnetwork/ckb-sdk-core'

const TEST_PRIVATE_KEY = '0xc5bd09c9b954559c70a77d68bde95369e2ce910556ddc20f739080cde3b62ef2'
const TEST_ADDRESS = 'ckt1qyq0scej4vn0uka238m63azcel7cmcme7f2sxj5ska'

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
  const cotaLock = addressToScript(TEST_ADDRESS)

  const cotaNfts: CotaNft[] = [
    {
      cotaId: '0xc27328c95e27723d42770261d05355977aa5c89a',
      tokenIndex: '0x00000000',
      state: '0x00',
      characteristic: '0x0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a',
    },
  ]

  // Testnet
  let rawTx = await generateUpdateCotaTx(service, cotaLock, cotaNfts)

  // Mainnet
  // let rawTx = await generateUpdateCotaTx(service, cotaLock, cotaNfts, FEE, true)

  const secp256k1Dep = await secp256k1CellDep(ckb)
  rawTx.cellDeps.push(secp256k1Dep)

  const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Update cota nft tx has been sent with tx hash ${txHash}`)
}

run()
