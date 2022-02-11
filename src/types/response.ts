import { Byte32, Bytes } from './common'

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
