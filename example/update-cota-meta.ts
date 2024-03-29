import { addressToScript, scriptToHash, serializeScript } from '@nervosnetwork/ckb-sdk-utils'
import { Collector } from '../src/collector'
import { Aggregator } from '../src/aggregator'
import { Service, FEE, CotaInfo } from '../src'
import { generateCotaMetadataTx } from '../src/service/cota/cota-meta'

const TEST_PRIVATE_KEY = '0xc5bd09c9b954559c70a77d68bde95369e2ce910556ddc20f739080cde3b62ef2'
const TEST_ADDRESS = 'ckt1qyq0scej4vn0uka238m63azcel7cmcme7f2sxj5ska'

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
      ckbNodeUrl: 'https://testnet.ckb.dev/rpc',
      ckbIndexerUrl: 'https://testnet.ckb.dev/indexer',
    }),
    aggregator: new Aggregator({ registryUrl: 'http://localhost:3050', cotaUrl: 'http://localhost:3030' }),
  }
  const ckb = service.collector.getCkb()
  const cotaLock = addressToScript(TEST_ADDRESS)

  console.log(`lock ${serializeScript(cotaLock)}`)

  const cotaId = '0x1deb31f603652bf59ff5027b522e1d81c288b72f'

  const cotaInfo: CotaInfo = {
    name: 'Update First Step',
    description:
      'First step to Blockchain mass adoption. NFT platform launch memento.\n\n-- Nervina Labs & Lay2 Tech, 4/30/2021.',
    image: 'https://i.loli.net/2021/04/29/qyJNSE4iHAas7GL.png',
    audios: [
      {
        name: 'audio01',
        url: 'https://i.loli.net/2021/04/29/qyJNSE4iHAas7GL.png',
        cotaId,
        idx: 0,
      },
      {
        name: 'audio02',
        url: 'https://i.loli.net/2021/04/29/qyJNSE4iHAas7GL.png',
        cotaId,
        idx: 1,
      },
    ],
  }

  let rawTx = await generateCotaMetadataTx(service, cotaLock, cotaId, cotaInfo, FEE, isMainnet)
  rawTx.cellDeps.push(secp256k1CellDep(isMainnet))

  console.log(
    'lock',
    serializeScript(
      addressToScript(
        'ckt1qrfrwcdnvssswdwpn3s9v8fp87emat306ctjwsm3nmlkjg8qyza2cqgqq9mxjf0qnyfusww65kapv2rc0qdm6sjpvvadd4hp',
      ),
    ),
  )

  // const signedTx = ckb.signTransaction(TEST_PRIVATE_KEY)(rawTx)
  // console.log(JSON.stringify(signedTx))
  // let txHash = await ckb.rpc.sendTransaction(signedTx, 'passthrough')
  // console.info(`Update cota metadata information tx has been sent with tx hash ${txHash}`)
}

run()
