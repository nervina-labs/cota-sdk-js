import { Byte, Byte20, Byte24, Byte32, Byte4, Bytes } from './common'

export interface SmtReq {}

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

export interface Withdrawal {
  cotaId: Byte20
  tokenIndex: Byte4
  toLockScript: Bytes
}

export interface WithdrawalReq extends SmtReq {
  lockHash: CKBComponents.Hash
  outPoint: Byte24
  withdrawals: Withdrawal[]
}

export interface TransferReq extends SmtReq {
  lockScript: Bytes
  withdrawalLockHash: CKBComponents.Hash
  transferOutPoint: Byte24
  transfers: Withdrawal[]
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

export interface UpdateReq extends SmtReq {
  lockHash: Byte32
  nfts: {
    cotaId: Byte20
    tokenIndex: Byte4
    state: Byte
    characteristic: Byte20
  }[]
}

export interface GetCotaReq extends SmtReq {
  lockScript: Bytes
  page: number
  pageSize: number
}

export interface IsClaimedReq extends SmtReq {
  lockHash: Byte32
  cotaId: Byte20
  tokenIndex: Byte4
}

export interface GetCotaSenderReq extends SmtReq {
  lockScript: Bytes
  cotaId: Byte20
  tokenIndex: Byte4
}
