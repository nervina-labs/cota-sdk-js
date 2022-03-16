export const FEE = BigInt(160000)
export const MIN_CAPACITY = BigInt(61) * BigInt(100000000)

const TestnetInfo = {
  RegistryTypeScript: {
    codeHash: '0x9302db6cc1344b81a5efee06962abcb40427ecfcbe69d471b01b2658ed948075',
    hashType: 'type',
    args: '0xf9910364e0ca81a0e074f3aa42fe78cfcc880da6',
  } as CKBComponents.Script,

  CotaTypeScript: {
    codeHash: '0x89cd8003a0eaf8e65e0c31525b7d1d5c1becefd2ea75bb4cff87810ae37764d8',
    hashType: 'type',
    args: '0x',
  } as CKBComponents.Script,

  CotaTypeDep: {
    outPoint: { txHash: '0x2dfcab7790f3cabffe5cb349546dac8918b409481828218cc162f9de5754116f', index: '0x0' },
    depType: 'depGroup',
  } as CKBComponents.CellDep,

  AlwaysSuccessLockScript: {
    codeHash: '0x1157470ca9de091c21c262bf0754b777f3529e10d2728db8f6b4e04cfc2fbb5f',
    hashType: 'data',
    args: '0x',
  } as CKBComponents.Script,

  AlwaysSuccessLockDep: {
    outPoint: { txHash: '0x46a7625a76cf7401eff1dfe4f46138be69316518c9771c9f780a428843c6b5b1', index: '0x0' },
    depType: 'code',
  } as CKBComponents.CellDep,
}

const MainnetInfo = {
  RegistryTypeScript: {
    codeHash: '0x90ca618be6c15f5857d3cbd09f9f24ca6770af047ba9ee70989ec3b229419ac7',
    hashType: 'type',
    args: '0x563631b49cee549f3585ab4dde5f9d590f507f1f',
  } as CKBComponents.Script,

  CotaTypeScript: {
    codeHash: '0x1122a4fb54697cf2e6e3a96c9d80fd398a936559b90954c6e88eb7ba0cf652df',
    hashType: 'type',
    args: '0x',
  } as CKBComponents.Script,

  CotaTypeDep: {
    outPoint: { txHash: '0xae2d5838730fc096e68fe839aea50d294493e10054513c10ca35e77e82e9243b', index: '0x0' },
    depType: 'depGroup',
  } as CKBComponents.CellDep,

  AlwaysSuccessLockScript: {
    codeHash: '0xd483925160e4232b2cb29f012e8380b7b612d71cf4e79991476b6bcf610735f6',
    hashType: 'data',
    args: '0x',
  } as CKBComponents.Script,

  AlwaysSuccessLockDep: {
    outPoint: { txHash: '0x81e22f4bb39080b112e5efb18e3fad65ebea735eac2f9c495b7f4d3b4faa377d', index: '0x0' },
    depType: 'code',
  } as CKBComponents.CellDep,
}

export const getCotaTypeScript = (isMainnet = false) =>
  isMainnet ? MainnetInfo.CotaTypeScript : TestnetInfo.CotaTypeScript

export const getReistryTypeScript = (isMainnet = false) =>
  isMainnet ? MainnetInfo.RegistryTypeScript : TestnetInfo.RegistryTypeScript

export const getCotaCellDep = (isMainnet = false) => (isMainnet ? MainnetInfo.CotaTypeDep : TestnetInfo.CotaTypeDep)

export const getAlwaysSuccessLock = (isMainnet = false) =>
  isMainnet ? MainnetInfo.AlwaysSuccessLockScript : TestnetInfo.AlwaysSuccessLockScript

export const getAlwaysSuccessCellDep = (isMainnet = false) =>
  isMainnet ? MainnetInfo.AlwaysSuccessLockDep : TestnetInfo.AlwaysSuccessLockDep
