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

export interface CotaAudio {
  name: string
  url: string
  idx: number
  cotaId: Byte20
}

export interface CotaInfo {
  name: string
  image: string
  description?: string
  audio?: string
  audios?: CotaAudio[]
  video?: string
  model?: string
  characteristic?: [string, number][]
  properties?: string
}
