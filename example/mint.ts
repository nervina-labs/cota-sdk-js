import { addressToScript, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { Collector } from '../src/collector'
import { Aggregator } from '../src/aggregator'
import { generateMintCotaTx } from '../src/service/cota'
import { MintCotaInfo, Service } from '../src'
import CKB from '@nervosnetwork/ckb-sdk-core'

const TEST_PRIVATE_KEY = '0xc5bd09c9b954559c70a77d68bde95369e2ce910556ddc20f739080cde3b62ef2'
const TEST_ADDRESS = 'ckt1qyq0scej4vn0uka238m63azcel7cmcme7f2sxj5ska'
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
  const mintLock = addressToScript(TEST_ADDRESS)

  const mintCotaInfo: MintCotaInfo = {
    cotaId: '0x1deb31f603652bf59ff5027b522e1d81c288b72f',
    withdrawals: [
      {
        tokenIndex: '0x00000000',
        state: '0x00',
        characteristic: '0xa505050505050505050505050505050505050505',
        toLockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
      },
      {
        tokenIndex: '0x00000001',
        state: '0x00',
        characteristic: '0xa505050505050505050505050505050505050505',
        toLockScript: serializeScript(addressToScript(RECEIVER_ADDRESS)),
      },
    ],
  }
  let rawTx = await generateMintCotaTx(service, mintLock, mintCotaInfo)

  const secp256k1Dep = await secp256k1CellDep(ckb)
  rawTx.cellDeps.push(secp256k1Dep)

  const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Mint cota nft tx has been sent with tx hash ${txHash}`)
}

run()
