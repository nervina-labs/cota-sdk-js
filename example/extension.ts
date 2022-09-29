import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { Collector } from '../src/collector'
import { Aggregator } from '../src/aggregator'
import { Service } from '../src'
import { generateExtensionTx } from '../src/service/cota/extension'

const TEST_PRIVATE_KEY = '0xee56672e70cec79941adc0637c1edb1546a0c39c72eff8c41bc4f1e03bf663b3'
const TEST_ADDRESS = 'ckt1qyq897k5m53wxzup078jwkucvvsu8kzv55rqqm6glm'

const secp256k1CellDep = (isMainnet: boolean): CKBComponents.CellDep => {
  if (isMainnet) {
    return { outPoint: {
      txHash: "0x71a7ba8fc96349fea0ed3a5c47992e3b4084b031a42264a018e0072e8172e46c",
      index: "0x0",
    }, depType: 'depGroup' }
  }
  return { outPoint: {
      txHash: "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
      index: "0x0",
    }, depType: 'depGroup' }
}

const run = async () => {
  // True for mainnet and false for testnet
  const isMainnet = false

  const service: Service = {
    collector: new Collector({ ckbNodeUrl: 'https://testnet.ckb.dev/rpc', ckbIndexerUrl: 'https://testnet.ckb.dev/indexer' }),
    aggregator: new Aggregator({ registryUrl: 'http://localhost:3050', cotaUrl: 'http://localhost:3030' }),
  }
  const ckb = service.collector.getCkb()
  const extensionLock = addressToScript(TEST_ADDRESS)

  let rawTx = await generateExtensionTx(service, extensionLock, BigInt(6000), isMainnet)
  rawTx.cellDeps.push(secp256k1CellDep(isMainnet))

  const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Add cota extension tx has been sent with tx hash ${txHash}`)
}

run()
