import { Aggregator, Collector } from '..'

export * from './common'
export * from './request'
export * from './response'
export * from './collector'

export interface Config {
  collector: Collector
  aggregator: Aggregator
}
