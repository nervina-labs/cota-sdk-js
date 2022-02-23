# cota-sdk-js

[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/nervina-labs/cota-sdk-js/blob/develop/LICENSE)
[![CI](https://github.com/nervina-labs/cota-sdk-js/actions/workflows/build.yml/badge.svg?branch=develop)](https://github.com/nervina-labs/cota-sdk-js/actions)
[![NPM](https://img.shields.io/npm/v/@nervina-labs/cota-sdk/latest.svg)](https://www.npmjs.com/package/@nervina-labs/cota-sdk)

JavaScript SDK for [CoTA](https://talk.nervos.org/t/rfc-cota-a-compact-token-aggregator-standard-for-extremely-low-cost-nfts-and-fts/6338).

[CoTA Docs](https://developer.mibao.net/docs/develop/cota/overview)

## Feature

- Provide methods for [cota-aggregator](https://github.com/nervina-labs/cota-aggregator) and [cota-registry-aggregator](https://github.com/nervina-labs/cota-registry-aggregator) RPC APIs
- Provide methods to generate CoTA operating transactions

## Prerequisites

- [CKB Node](https://docs.nervos.org/docs/basics/guides/testnet)
- [CKB Indexer](https://github.com/nervosnetwork/ckb-indexer) 
- [CoTA Registry Aggregator](https://github.com/nervina-labs/cota-registry-aggregator)
- [CoTA Aggregator](https://github.com/nervina-labs/cota-aggregator)

### Public ckb node url and ckb indexer url as blow can be used to develop and test
```
mainnet
https://mainnet.ckbapp.dev  --->  ckb mainnet rpc 
https://mainnet.ckbapp.dev/rpc  --->  ckb mainnet rpc 
https://mainnet.ckbapp.dev/indexer  --->  ckb mainnet indexer_rpc 

testnet:
https://testnet.ckbapp.dev  --->  ckb testnet rpc 
https://testnet.ckbapp.dev/rpc  --->  ckb testnet rpc 
https://testnet.ckbapp.dev/indexer  --->  ckb testnet indexer_rpc
```

## Examples

- [aggregator example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/aggregator.ts): Fetch CoTA NFT data and [SMT](https://github.com/nervosnetwork/sparse-merkle-tree) data from Aggregator server
- [registry example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/define.ts): Generate registering CoTA cells transaction
- [define example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/define.ts): Generate defining CoTA cells transaction
- [mint example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/mint.ts): Generate minting CoTA NFT transaction
- [claim example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/claim.ts): Generate claiming CoTA NFT transaction
- [withdraw example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/withdraw.ts): Generate withdrawing CoTA NFT transaction
- [transfer example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/transfer.ts): Generate transferring CoTA NFT transaction
- [update example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/update.ts): Generate updating CoTA NFT information transaction