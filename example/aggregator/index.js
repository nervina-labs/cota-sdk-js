const { Aggregator } = require('@nervina-labs/cota-sdk')

const run = async () => {
  const aggregator = new Aggregator({
    registryUrl: 'http://localhost:3050',
    cotaUrl: 'https://cota.nervina.dev/mainnet-aggregator',
  })
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
}

run()
