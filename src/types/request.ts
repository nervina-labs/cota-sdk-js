import { Byte, Byte20, Byte24, Byte32, Byte4, Bytes } from './common'

export interface SmtReq {}

export interface DefineReq extends SmtReq {
  lockScript: Bytes
  cotaId: Byte20
  total: Byte4
  issued: Byte4
  configure: Byte
}

export interface MintWithdrawal {
  tokenIndex?: Byte4
  state: Byte
  characteristic: Byte20
  toLockScript: Bytes
}

export interface MintReq extends SmtReq {
  lockScript: Bytes
  cotaId: Byte20
  outPoint: Byte24
  withdrawals: MintWithdrawal[]
}

export interface TransferWithdrawal {
  cotaId: Byte20
  tokenIndex: Byte4
  toLockScript: Bytes
}

export interface WithdrawalReq extends SmtReq {
  lockScript: Bytes
  outPoint: Byte24
  withdrawals: TransferWithdrawal[]
}

export interface TransferReq extends SmtReq {
  lockScript: Bytes
  withdrawalLockScript: Bytes
  transferOutPoint: Byte24
  transfers: TransferWithdrawal[]
}

export interface Claim {
  cotaId: Byte20
  tokenIndex: Byte4
}

export interface ClaimReq extends SmtReq {
  lockScript: Bytes
  withdrawalLockScript: Bytes
  claims: Claim[]
}

export interface CotaNft {
  cotaId: Byte20
  tokenIndex: Byte4
  state: Byte
  characteristic: Byte20
}

export interface UpdateReq extends SmtReq {
  lockScript: Bytes
  nfts: CotaNft[]
}

export interface ClaimUpdateReq extends SmtReq {
  lockScript: Bytes
  withdrawalLockScript: Bytes
  nfts: CotaNft[]
}

export interface TransferUpdate {
  cotaId: Byte20
  tokenIndex: Byte4
  toLockScript: Bytes
  state: Byte
  characteristic: Byte20
}

export interface TransferUpdateReq extends SmtReq {
  lockScript: Bytes
  withdrawalLockScript: Bytes
  transferOutPoint: Byte24
  transfers: TransferUpdate[]
}

export interface GetCotaReq extends SmtReq {
  lockScript: Bytes
  page: number
  pageSize: number
  cotaId?: Byte20
}

export interface IsClaimedReq extends SmtReq {
  lockScript: Bytes
  cotaId: Byte20
  tokenIndex: Byte4
}

export interface GetCotaSenderReq extends SmtReq {
  lockScript: Bytes
  cotaId: Byte20
  tokenIndex: Byte4
}

export interface GetDefineInfoReq extends SmtReq {
  cotaId: Byte20
}

export interface GetIssuerInfoReq extends SmtReq {
  lockScript: Bytes
}

export interface GetCotaCountReq extends SmtReq {
  lockScript: Bytes
  cotaId: Byte20
}

export interface ExtensionReq extends SmtReq {
  lockScript: Bytes
}