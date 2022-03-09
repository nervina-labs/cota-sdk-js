import { Byte20, MintWithdrawal } from '.'
import { Aggregator, Collector } from '..'

export interface MintCotaInfo {
  cotaId: Byte20
  withdrawals: MintWithdrawal[]
}

export interface Service {
  collector: Collector
  aggregator: Aggregator
}

export interface IssuerInfo {
  name: string
  description?: string
  avatar?: string
}

export interface CotaInfo {
  name: string
  image: string
  description?: string
  audio?: string
  video?: string
  model?: string
  characteristic?: [string, number][]
  properties?: string
}
