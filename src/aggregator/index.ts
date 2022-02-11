import axios from 'axios'
import { toCamelcase, toSnakeCase } from '../utils/case-parser'
import { ClaimReq, DefineReq, MintReq, SmtReq, TransferReq, UpdateReq, WithdrawalReq } from '../types/request'
import {
  ClaimResp,
  DefineResp,
  MintResp,
  RegistryResp,
  SmtResp,
  TransferResp,
  UpdateResp,
  WithdrawalResp,
} from '../types/response'

export class Aggregator {
  private registryUrl: string
  private cotaUrl: string

  constructor(registryUrl: string, cotaUrl: string) {
    this.registryUrl = registryUrl
    this.cotaUrl = cotaUrl
  }

  private async generateCotaSmt(method: string, req: SmtReq, url = this.cotaUrl): Promise<SmtResp | undefined> {
    let payload = {
      id: 1,
      jsonrpc: '2.0',
      method,
      params: toSnakeCase(req),
    }
    const body = JSON.stringify(payload, null, '')
    try {
      let response = (
        await axios({
          method: 'post',
          url,
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 20000,
          data: body,
        })
      ).data
      if (response.error) {
        console.error(response)
      } else {
        console.log(JSON.stringify(response))
        return toCamelcase(response.result)
      }
    } catch (error) {
      console.error('error', error)
    }
  }

  async generateRegisterCotaSmt(lockHashes: CKBComponents.Hash[]): Promise<RegistryResp> {
    return (await this.generateCotaSmt('register_cota_cells', lockHashes, this.registryUrl)) as Promise<RegistryResp>
  }

  async generateDefineCotaSmt(define: DefineReq): Promise<DefineResp> {
    return (await this.generateCotaSmt('generate_define_cota_smt', define)) as Promise<DefineResp>
  }

  async generateMintCotaSmt(mint: MintReq): Promise<MintResp> {
    return (await this.generateCotaSmt('generate_mint_cota_smt', mint)) as Promise<MintResp>
  }

  async generateWithdrawalCotaSmt(withdrawal: WithdrawalReq): Promise<WithdrawalResp> {
    return (await this.generateCotaSmt('generate_withdrawal_cota_smt', withdrawal)) as Promise<WithdrawalResp>
  }

  async generateTransferCotaSmt(transfer: TransferReq): Promise<TransferResp> {
    return (await this.generateCotaSmt('generate_transfer_cota_smt', transfer)) as Promise<TransferResp>
  }

  async generateClaimCotaSmt(claim: ClaimReq): Promise<ClaimResp> {
    return (await this.generateCotaSmt('generate_claim_cota_smt', claim)) as Promise<ClaimResp>
  }

  async generateUpdateCotaSmt(update: UpdateReq): Promise<UpdateResp> {
    return (await this.generateCotaSmt('generate_update_cota_smt', update)) as Promise<UpdateResp>
  }
}
