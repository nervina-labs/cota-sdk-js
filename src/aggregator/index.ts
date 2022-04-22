import axios from 'axios'
import { toCamelcase, toSnakeCase } from '../utils/case-parser'
import {
  ClaimReq,
  DefineReq,
  GetCotaReq,
  IsClaimedReq,
  MintReq,
  SmtReq,
  TransferReq,
  UpdateReq,
  WithdrawalReq,
  GetCotaSenderReq,
  ClaimUpdateReq,
  TransferUpdateReq,
  GetDefineInfoReq,
  GetIssuerInfoReq,
  GetCotaCountReq,
} from '../types/request'
import {
  ClaimResp,
  DefineResp,
  GetHoldResp,
  GetMintResp,
  GetWithdrawalResp,
  IsClaimedResp,
  MintResp,
  RegistryResp,
  SmtResp,
  TransferResp,
  UpdateResp,
  WithdrawalResp,
  GetCotaSenderResp,
  ClaimUpdateResp,
  TransferUpdateResp,
  CheckRegisteredResp,
  GetDefineInfoResp,
  GetIssuerInfoResp,
  GetCotaCountResp,
} from '../types/response'
import { Byte32 } from '../types/common'

export class Aggregator {
  private registryUrl: string
  private cotaUrl: string

  constructor({ registryUrl, cotaUrl }: { registryUrl: string; cotaUrl: string }) {
    this.registryUrl = registryUrl
    this.cotaUrl = cotaUrl
  }

  private async baseRPC(method: string, req: SmtReq, url = this.cotaUrl): Promise<SmtResp | undefined> {
    let payload = {
      id: 1,
      jsonrpc: '2.0',
      method,
      params: toSnakeCase(req),
    }
    const body = JSON.stringify(payload, null, '')
    console.log(body)
    try {
      let response = (
        await axios({
          method: 'post',
          url,
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 60000,
          data: body,
        })
      ).data
      if (response.error) {
        console.error(response)
      } else {
        return toCamelcase(response.result)
      }
    } catch (error) {
      console.error('error', error)
    }
  }

  async generateRegisterCotaSmt(lockHashes: Byte32[]): Promise<RegistryResp> {
    return (await this.baseRPC('register_cota_cells', lockHashes, this.registryUrl)) as Promise<RegistryResp>
  }

  async checkReisteredLockHashes(lockHashes: Byte32[]): Promise<CheckRegisteredResp> {
    return (await this.baseRPC(
      'check_registered_lock_hashes',
      lockHashes,
      this.registryUrl,
    )) as Promise<CheckRegisteredResp>
  }

  async generateDefineCotaSmt(define: DefineReq): Promise<DefineResp> {
    return (await this.baseRPC('generate_define_cota_smt', define)) as Promise<DefineResp>
  }

  async generateMintCotaSmt(mint: MintReq): Promise<MintResp> {
    return (await this.baseRPC('generate_mint_cota_smt', mint)) as Promise<MintResp>
  }

  async generateWithdrawalCotaSmt(withdrawal: WithdrawalReq): Promise<WithdrawalResp> {
    return (await this.baseRPC('generate_withdrawal_cota_smt', withdrawal)) as Promise<WithdrawalResp>
  }

  async generateTransferCotaSmt(transfer: TransferReq): Promise<TransferResp> {
    return (await this.baseRPC('generate_transfer_cota_smt', transfer)) as Promise<TransferResp>
  }

  async generateClaimCotaSmt(claim: ClaimReq): Promise<ClaimResp> {
    return (await this.baseRPC('generate_claim_cota_smt', claim)) as Promise<ClaimResp>
  }

  async generateTransferUpdateCotaSmt(transfer: TransferUpdateReq): Promise<TransferUpdateResp> {
    return (await this.baseRPC('generate_transfer_update_cota_smt', transfer)) as Promise<TransferUpdateResp>
  }

  async generateClaimUpdateCotaSmt(claim: ClaimUpdateReq): Promise<ClaimUpdateResp> {
    return (await this.baseRPC('generate_claim_update_cota_smt', claim)) as Promise<ClaimUpdateResp>
  }

  async generateUpdateCotaSmt(update: UpdateReq): Promise<UpdateResp> {
    return (await this.baseRPC('generate_update_cota_smt', update)) as Promise<UpdateResp>
  }

  async getHoldCotaNft(req: GetCotaReq): Promise<GetHoldResp> {
    return (await this.baseRPC('get_hold_cota_nft', convert(req))) as Promise<GetHoldResp>
  }

  async getWithdrawCotaNft(req: GetCotaReq): Promise<GetWithdrawalResp> {
    return (await this.baseRPC('get_withdrawal_cota_nft', convert(req))) as Promise<GetWithdrawalResp>
  }

  async getMintCotaNft(req: GetCotaReq): Promise<GetMintResp> {
    return (await this.baseRPC('get_mint_cota_nft', convert(req))) as Promise<GetMintResp>
  }

  async isClaimed(req: IsClaimedReq): Promise<IsClaimedResp> {
    return (await this.baseRPC('is_claimed', req)) as Promise<IsClaimedResp>
  }

  async getCotaNftSender(req: GetCotaSenderReq): Promise<GetCotaSenderResp> {
    return (await this.baseRPC('get_cota_nft_sender', req)) as Promise<GetCotaSenderResp>
  }

  async getDefineInfo(req: GetDefineInfoReq): Promise<GetDefineInfoResp> {
    return (await this.baseRPC('get_define_info', req)) as Promise<GetDefineInfoResp>
  }

  async getIssuerInfo(req: GetIssuerInfoReq): Promise<GetIssuerInfoResp> {
    return (await this.baseRPC('get_issuer_info', req)) as Promise<GetIssuerInfoResp>
  }

  async getCotaCount(req: GetCotaCountReq): Promise<GetCotaCountResp> {
    return (await this.baseRPC('get_cota_count', req)) as Promise<GetCotaCountResp>
  }
}

const convert = (req: GetCotaReq) => ({
  ...req,
  page: req.page.toString(),
  pageSize: req.pageSize.toString(),
})
