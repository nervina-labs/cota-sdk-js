import { hexToBytes, PERSONAL, scriptToHash, serializeInput } from '@nervosnetwork/ckb-sdk-utils'
import blake2b from '@nervosnetwork/ckb-sdk-utils/lib/crypto/blake2b'
import { Byte, Service, DefineReq } from '../..'
import { FEE, TestnetDeployment } from '../../constants'
import { u8ToHex, u32ToBe, append0x } from '../../utils'

const generateCotaId = (firstInput: CKBComponents.CellInput, definesIndex: number) => {
  const input = hexToBytes(serializeInput(firstInput))
  const s = blake2b(32, null, null, PERSONAL)
  s.update(input)
  s.update(hexToBytes(`0x${u8ToHex(definesIndex)}`))
  return `0x${s.digest('hex').slice(0, 40)}`
}

export const generateDefineCotaTx = async (
  service: Service,
  cotaLock: CKBComponents.Script,
  total: number,
  confiure: Byte,
  fee = FEE,
) => {
  const cotaType = TestnetDeployment.CotaTypeScript
  const cotaCells = await service.collector.getCells(cotaLock, cotaType)
  if (!cotaCells || cotaCells.length === 0) {
    throw new Error("Cota cell doesn't exist")
  }
  const cotaCell = cotaCells[0]
  const inputs = [
    {
      previousOutput: cotaCell.outPoint,
      since: '0x0',
    },
  ]

  const outputs = [cotaCell.output]
  outputs[0].capacity = `0x${(BigInt(outputs[0].capacity) - fee).toString(16)}`

  const cotaId = generateCotaId(inputs[0], 0)
  console.info(`cotaId:  ${cotaId}`)

  const defineReq: DefineReq = {
    lockHash: scriptToHash(cotaLock),
    cotaId,
    total: append0x(u32ToBe(total)),
    issued: '0x00000000',
    configure: append0x(confiure),
  }

  const { smtRootHash, defineSmtEntry } = await service.aggregator.generateDefineCotaSmt(defineReq)
  const cotaCellData = `0x00${smtRootHash}`

  const outputsData = [cotaCellData]
  const cellDeps = [TestnetDeployment.CotaTypeDep]

  const rawTx = {
    version: '0x0',
    cellDeps,
    headerDeps: [],
    inputs,
    outputs,
    outputsData,
    witnesses: [],
  }
  rawTx.witnesses = rawTx.inputs.map((_, i) =>
    i > 0 ? '0x' : { lock: '', inputType: `0x01${defineSmtEntry}`, outputType: '' },
  )
  return { rawTx, cotaId }
}
