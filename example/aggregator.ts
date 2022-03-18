import { Aggregator } from '../src/aggregator'

const run = async () => {
  const aggregator = new Aggregator({ registryUrl: 'http://localhost:3050', cotaUrl: 'http://localhost:3030' })
  const holds = await aggregator.getHoldCotaNft({
    lockScript:
      '0x490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000dc70f33de86fdf381b4fc5bf092bb23d02774801',
    page: 0,
    pageSize: 10,
  })
  console.log(JSON.stringify(holds))

  const senderLockHash = await aggregator.getCotaNftSender({
    lockScript:
      '0x490000001000000030000000310000009bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce80114000000dc70f33de86fdf381b4fc5bf092bb23d02774801',
    cotaId: '0xb22585a8053af3fed0fd39127f5b1487ce08b756',
    tokenIndex: '0x00000000',
  })
  console.log(JSON.stringify(senderLockHash))

  const result = await aggregator.checkReisteredLockHashes([
    '0x6a8f45a094cbe050d1a612924901b11edc1bce28c0fd8d96cdc8779889f28aa8',
    '0xbe30bcf4cfc2203cb7bf53b111cae4ced9af8674f088f8ea54b3efb76a5a4050',
  ])
  console.log(JSON.stringify(result))
}

run()
