export const FEE = BigInt(160000)
export const MIN_CAPACITY = BigInt(61) * BigInt(100000000)

const TestnetInfo = {
  RegistryTypeScript: {
    codeHash: '0xc32f3f0a54895468537dc86344766a78a2702ab28e4885afec5118f7f49d8c1b',
    hashType: 'type',
    args: '0xcb3e4801d06f3c269ae559499bb96adeaea6e425',
  } as CKBComponents.Script,

  CotaTypeScript: {
    codeHash: '0x109cee8132469a37c194e9f391dfed96caf1b557ca85e604ec415f6da7a79308',
    hashType: 'type',
    args: '0x',
  } as CKBComponents.Script,

  CotaTypeDep: {
    outPoint: { txHash: '0x060d61528042ad956464237f89abbae8e25caa3d5f9cd33ee397aae4a295f991', index: '0x0' },
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
    outPoint: { txHash: '0x207c0ab1a25f63198c0cb73a9f201585ac39619e0a32cb2339e7cd95858dbe72', index: '0x0' },
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

export function getRegistryTypeScript(isMainnet = false) {
  return isMainnet ? MainnetInfo.RegistryTypeScript : TestnetInfo.RegistryTypeScript
}

export const getCotaCellDep = (isMainnet = false) => (isMainnet ? MainnetInfo.CotaTypeDep : TestnetInfo.CotaTypeDep)

export const getAlwaysSuccessLock = (isMainnet = false) =>
  isMainnet ? MainnetInfo.AlwaysSuccessLockScript : TestnetInfo.AlwaysSuccessLockScript

export const getAlwaysSuccessCellDep = (isMainnet = false) =>
  isMainnet ? MainnetInfo.AlwaysSuccessLockDep : TestnetInfo.AlwaysSuccessLockDep
