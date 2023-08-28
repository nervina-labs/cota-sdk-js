import { Byte, Byte20, Byte32, Byte4, Bytes } from './common'

export interface SmtResp {}

export interface RegistryResp {
  smtRootHash: Byte32
  registrySmtEntry: Bytes
  blockNumber: bigint
}

export interface CheckRegisteredResp {
  registered: boolean
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
  withdrawBlockHash: Byte32
  blockNumber: bigint
}

export interface ClaimResp extends SmtResp {
  smtRootHash: Byte32
  claimSmtEntry: Bytes
  withdrawBlockHash: Byte32
  blockNumber: bigint
}

export interface UpdateResp extends SmtResp {
  smtRootHash: Byte32
  updateSmtEntry: Bytes
  blockNumber: bigint
}

export interface ClaimUpdateResp extends SmtResp {
  smtRootHash: Byte32
  claimUpdateSmtEntry: Bytes
  withdrawBlockHash: Byte32
  blockNumber: bigint
}

export interface TransferUpdateResp extends SmtResp {
  smtRootHash: Byte32
  transferUpdateSmtEntry: Bytes
  withdrawBlockHash: Byte32
  blockNumber: bigint
}

export interface SequentialTransferResp extends SmtResp {
  smtRootHash: Byte32
  transferSmtEntry: Bytes
  withdrawBlockHash: Byte32
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
    audio: string
    video: string
    model: string
    metaCharacteristic: string
    properties: string
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
    audio: string
    video: string
    model: string
    metaCharacteristic: string
    properties: string
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

export interface GetDefineInfoResp {
  total: number
  issued: number
  configure: Byte
  blockNumber: bigint
  name: string
  description: string
  image: string
  audio: string
  video: string
  model: string
  metaCharacteristic: string
  properties: string
}

export interface GetIssuerInfoResp {
  name: string
  avatar: string
  description: string
}

export interface GetCotaCountResp {
  count: number
  blockNumber: bigint
}

export interface ExtensionResp extends SmtResp {
  smtRootHash: Byte32
  extensionSmtEntry: Bytes
  blockNumber: bigint
}
