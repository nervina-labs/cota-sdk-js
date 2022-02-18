import { Byte, Byte20, Byte32, Byte4, Bytes } from './common'

export interface SmtResp {}

export interface RegistryResp {
  smtRootHash: Byte32
  registrySmtEntry: Bytes
  blockNumber: bigint
}

export interface DefineResp extends SmtResp {
  smtRootHash: Byte32
  defineSmtEntry: Bytes
  blockNumber: bigint
}

export interface MintResp extends SmtResp {
  smtRootHash: Byte32
  mintSmtEntry: Bytes
  blockNumber: bigint
}

export interface WithdrawalResp extends SmtResp {
  smtRootHash: Byte32
  withdrawalSmtEntry: Bytes
  blockNumber: bigint
}

export interface TransferResp extends SmtResp {
  smtRootHash: Byte32
  transferSmtEntry: Bytes
  blockNumber: bigint
}

export interface ClaimResp extends SmtResp {
  smtRootHash: Byte32
  claimSmtEntry: Bytes
  blockNumber: bigint
}

export interface UpdateResp extends SmtResp {
  smtRootHash: Byte32
  updateSmtEntry: Bytes
  blockNumber: bigint
}

export interface GetHoldResp extends SmtResp {
  total: number
  pageSize: number
  blockNumber: bigint
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
  blockNumber: bigint
  nfts: {
    cotaId: Byte20
    tokenIndex: Byte4
    configure: Byte
    state: Byte
    characteristic: Byte20
    receiver_lock: Bytes
    name: string
    description: string
    image: string
  }[]
}

export interface IsClaimedResp {
  claimed: boolean
  blockNumber: bigint
}

export interface GetCotaSenderResp {
  senderLockHash: Byte32
  blockNumber: bigint
}
