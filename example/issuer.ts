import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'
import { Collector } from '../src/collector'
import { Aggregator } from '../src/aggregator'
import { generateIssuerInfoTx } from '../src/service/cota'
import { IssuerInfo, Service, FEE } from '../src'

const TEST_PRIVATE_KEY = '0x59df3d4584579a4b8ae77e4d7a851d68178a0e19dbbdd53b5daab543943e1b31'
const TEST_ADDRESS = 'ckt1qyqp8ydxwz3p4vcmjwc2d7zqk4xhv707j80q4yrap2'

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
  const cotaLock = addressToScript(TEST_ADDRESS)

  const issuer: IssuerInfo = {
    name: 'Nervina Labs example',
    description: 'Melting Two Worlds Together.',
    avatar: 'https://i.loli.net/2021/04/29/IigbpOWP8fw9qDn.png',
  }

  let rawTx = await generateIssuerInfoTx(service, cotaLock, issuer, FEE, isMainnet)
  rawTx.cellDeps.push(secp256k1CellDep(isMainnet))

  const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
  console.log(JSON.stringify(signedTx))
  let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  console.info(`Set issuer information tx has been sent with tx hash ${txHash}`)
}

run()
