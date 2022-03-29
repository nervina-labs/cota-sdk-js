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

CoTA SDK needs to run the services as blow:

- [CKB Node](https://docs.nervos.org/docs/basics/guides/testnet): Nervos CKB Node
- [CKB Indexer](https://github.com/nervosnetwork/ckb-indexer): Fetch live cells and transactions with filters
- [CoTA Syncer](https://github.com/nervina-labs/cota-nft-entries-syncer): Parse CoTA witness SMT data from CKB blockchain history transactions and save it to the mysql database
- [CoTA Registry Aggregator](https://github.com/nervina-labs/cota-registry-aggregator): Generate SMT info using the data from the database for registry and provide RPC APIs
- [CoTA Aggregator](https://github.com/nervina-labs/cota-aggregator): Generate SMT info using the data from the database for CoTA NFT actions and provide RPC APIs

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

## CoTA NFT Flow

```
                     Register CoTA cell firstly
1. Alice & Bob & Tom ----------------------------------> Alice CoTA cell & Bob CoTA cell & Tom CoTA cell

          Define CoTA NFT               Mint CoTA NFT A to receivers
2. Alice -----------------------> NFT A -----------------------------------> Receivers (Bob)

                    Claim NFT A                                  Withdraw NFT A to Tom
       Action1 |-------------------------> Bob hold NFT A now ----------------------------------> Bob doesnot hold NFT A now
      |             Transfer NFT A to Tom
3. Bob Action2 |-----------------------------------> Bob doesnot hold NFT A now
      |           Update CoTA NFT A information
       Action3 |-----------------------------------> Bob hold CoTA NFT A with new information

                    Claim NFT A                             Withdraw NFT A to other receviers
        Action1 |-------------------------> Tom hold NFT A now ----------------------------------> Tom doesnot hold NFT A now
4. Tom |         Transfer NFT A to other receviers
        Action2 |-----------------------------------> Tom doesnot hold NFT A now

```

## Examples

- [aggregator example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/aggregator.ts): Fetch CoTA NFT data and [SMT](https://github.com/nervosnetwork/sparse-merkle-tree) data from Aggregator server
- [registry example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/registry.ts): Generate registering CoTA cells transaction
- [issuer example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/issuer.ts): Generate setting issuer information transaction
- [define example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/define.ts): Generate setting cota information and defining CoTA cells transaction
- [mint example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/mint.ts): Generate minting CoTA NFT transaction
- [claim example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/claim.ts): Generate claiming CoTA NFT transaction
- [withdraw example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/withdraw.ts): Generate withdrawing CoTA NFT transaction
- [transfer example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/transfer.ts): Generate transferring CoTA NFT transaction
- [update example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/update.ts): Generate updating CoTA NFT information transaction
- [claim&update example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/claim-update.ts): Generate claiming and updateing CoTA NFT transaction
- [transfer&update example](https://github.com/nervina-labs/cota-sdk-js/blob/develop/example/transfer-update.ts): Generate transferring and updating CoTA NFT transaction
