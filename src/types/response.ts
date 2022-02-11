import { Byte, Byte20, Byte32, Byte4, Bytes } from './common'

export interface SmtResp {}

export interface RegistryResp {
  smtRootHash: Byte32
  registrySmtEntry: Bytes
}

export interface DefineResp extends SmtResp {
  smtRootHash: Byte32
  defineSmtEntry: Bytes
}

export interface MintResp extends SmtResp {
  smtRootHash: Byte32
  mintSmtEntry: Bytes
}

export interface WithdrawalResp extends SmtResp {
  smtRootHash: Byte32
  withdrawalSmtEntry: Bytes
}

export interface TransferResp extends SmtResp {
  smtRootHash: Byte32
  transferSmtEntry: Bytes
}

export interface ClaimResp extends SmtResp {
  smtRootHash: Byte32
  claimSmtEntry: Bytes
}

export interface UpdateResp extends SmtResp {
  smtRootHash: Byte32
  updateSmtEntry: Bytes
}

export interface GetHoldResp extends SmtResp {
  total: number
  pageSize: number
  nfts: {
    cotaId: Byte20
    index: Byte4
    configure: Byte
    state: Byte
    characteristic: Byte20
    name: string
    description: string
    image: string
  }[]
}

export type GetWithdrawalResp = GetHoldResp

export interface GetMintResp {
  total: number
  pageSize: number
  nfts: {
    cotaId: Byte20
    tokenIndex: Byte4
    configure: Byte
    state: Byte
    characteristic: Byte20
    receiver: Bytes
    name: string
    description: string
    image: string
  }[]
}

export interface IsClaimedResp {
  claimed: boolean
}