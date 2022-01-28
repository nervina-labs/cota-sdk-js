export interface SmtReq {}
export interface SmtResp {}

export type Hex = string
export type Byte = string
export type Byte4 = string
export type Byte20 = string
export type Byte24 = string
export type Byte32 = string
export type Bytes = string

export interface RegistryResp {
  smtRootHash: Hex
  registrySmtEntry: Hex
}

export interface DefineResp extends SmtResp {
  smtRootHash: Byte32
  defineSmtEntry: Bytes
}

export interface DefineReq extends SmtReq {
  lockHash: CKBComponents.Hash
  cotaId: Byte20
  total: Byte4
  issued: Byte4
  configure: Byte
}

export interface MintWithdrawal {
  tokenIndex: Byte4
  state: Byte
  characteristic: Byte20
  toLockScript: Bytes
}

export interface MintReq extends SmtReq {
  lockHash: CKBComponents.Hash
  cotaId: Byte20
  outPoint: Byte24
  withdrawals: MintWithdrawal[]
}

export interface MintResp extends SmtResp {
  smtRootHash: Byte32
  mintSmtEntry: Bytes
}

export interface TransferWithdrawal {
  cotaId: Byte20
  tokenIndex: Byte4
  toLockScript: Bytes
}

export interface WithdrawalReq extends SmtReq {
  lockHash: CKBComponents.Hash
  outPoint: Byte24
  withdrawals: TransferWithdrawal[]
}

export interface WithdrawalResp extends SmtResp {
  smtRootHash: Byte32
  withdrawalSmtEntry: Bytes
}

export interface TransferReq extends SmtReq {
  lockScript: Bytes
  withdrawalLockHash: CKBComponents.Hash
  transferOutPoint: Byte24
  transfers: TransferWithdrawal[]
}

export interface TransferResp extends SmtResp {
  smtRootHash: Byte32
  transferSmtEntry: Bytes
}

export interface Claim {
  cotaId: Byte20
  tokenIndex: Byte4
}

export interface ClaimReq extends SmtReq {
  lockScript: Bytes
  withdrawalLockHash: Byte32
  claims: Claim[]
}

export interface ClaimResp extends SmtResp {
  smtRootHash: Byte32
  claimSmtEntry: Bytes
}

export interface Nft {
  cotaId: Byte20
  tokenIndex: Byte4
  state: Byte
  characteristic: Byte20
}

export interface UpdateReq extends SmtReq {
  lockHash: Byte32
  nfts: Nft[]
}

export interface UpdateResp extends SmtResp {
  smtRootHash: Byte32
  updateSmtEntry: Bytes
}
