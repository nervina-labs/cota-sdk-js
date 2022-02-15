import { Aggregator, Collector } from '..'

export * from './common'
export * from './request'
export * from './response'
export * from './collector'

export interface Service {
  collector: Collector
  aggregator: Aggregator
}
