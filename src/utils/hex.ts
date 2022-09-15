import { hexToBytes, bytesToHex } from '@nervosnetwork/ckb-sdk-utils'

export const remove0x = (hex: string): string => {
  if (hex.startsWith('0x')) {
    return hex.substring(2)
  }
  return hex
}

export const append0x = (hex?: string): string => {
  return hex?.startsWith('0x') ? hex : `0x${hex}`
}

const ArrayBufferToHex = (arrayBuffer: ArrayBuffer): string => {
  return Array.prototype.map.call(new Uint8Array(arrayBuffer), x => ('00' + x.toString(16)).slice(-2)).join('')
}

export const u16ToBe = (u16: number): string => {
  let buffer = new ArrayBuffer(2)
  let view = new DataView(buffer)
  view.setUint16(0, u16, false)
  return ArrayBufferToHex(buffer)
}

const u32ToHex = (u32: string | number, littleEndian?: boolean): string => {
  let buffer = new ArrayBuffer(4)
  let view = new DataView(buffer)
  view.setUint32(0, Number(u32), littleEndian)
  return ArrayBufferToHex(buffer)
}

export const u32ToBe = (u32: string | number): string => {
  return u32ToHex(u32, false)
}

export const u32ToLe = (u32: string | number): string => {
  return u32ToHex(u32, true)
}

export const u8ToHex = (u8: number): string => {
  let buffer = new ArrayBuffer(1)
  let view = new DataView(buffer)
  view.setUint8(0, u8)
  return ArrayBufferToHex(buffer)
}

export const hexToU8 = (hex: string): number => {
  const tmp = remove0x(hex)
  if (tmp.length !== 2) {
    throw new Error('The hex format length of u8 must be equal to 2')
  }
  return parseInt(tmp, 16)
}

export const u64ToLe = (u64: bigint): string => {
  if (typeof u64 !== 'bigint') {
    throw new Error('u64 must be bigint')
  }
  const val = u64.toString(16).padStart(16, '0')
  const viewRight = u32ToLe(`0x${val.slice(0, 8)}`)
  const viewLeft = u32ToLe(`0x${val.slice(8)}`)
  return `${viewLeft}${viewRight}`
}

export const u64ToBe = (u64: bigint): string => {
  if (typeof u64 !== 'bigint') {
    throw new Error('u64 must be bigint')
  }
  const val = u64.toString(16).padStart(16, '0')
  const viewLeft = u32ToBe(`0x${val.slice(0, 8)}`)
  const viewRight = u32ToBe(`0x${val.slice(8)}`)
  return `${viewLeft}${viewRight}`
}

export const utf8ToHex = (text: string) => {
  let result = text.trim()
  if (result.startsWith('0x')) {
    return result
  }
  result = bytesToHex(new TextEncoder().encode(result))
  return result
}

export const hexToUtf8 = (hex: string) => {
  let result = hex.trim()
  try {
    result = new TextDecoder().decode(hexToBytes(result))
  } catch (error) {
    console.error('hexToUtf8 error:', error)
  }
  return result
}
