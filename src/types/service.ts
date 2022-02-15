import { Byte, Byte20, Byte4, Bytes } from '.'
import { Aggregator, Collector } from '..'

export interface MintCotaInfo {
  cotaId: Byte20
  withdrawals: {
    tokenIndex: Byte4
    state: Byte
    characteristic: Byte20
    toLockScript: Bytes
  }[]
}

export interface Service {
  collector: Collector
  aggregator: Aggregator
}
