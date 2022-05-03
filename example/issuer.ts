import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { Collector } from '../src/collector'
import { Aggregator } from '../src/aggregator'
import { generateIssuerInfoTx } from '../src/service/cota'
import { IssuerInfo, Service } from '../src'
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

  const issuer: IssuerInfo = {
    name: "Nervina Labs",
    description: "Melting Two Worlds Together.",
    avatar: "https://i.loli.net/2021/04/29/IigbpOWP8fw9qDn.png",
  }

  // Testnet
  let rawTx = await generateIssuerInfoTx(service, cotaLock, issuer)

  // Mainnet
  // let rawTx = await generateIssuerInfoTx(service, cotaLock, issuer, FEE, true)

  const secp256k1Dep = await secp256k1CellDep(ckb)
  rawTx.cellDeps.push(secp256k1Dep)

  const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Set issuer information tx has been sent with tx hash ${txHash}`)
}

run()
