type Hex = string
export interface IndexerCell {
  blockNumber: CKBComponents.BlockNumber
  outPoint: CKBComponents.OutPoint
  output: CKBComponents.CellOutput
  outputData: Hex[]
  txIndex: Hex
}

export interface CollectResult {
  inputs: CKBComponents.CellInput[]
  capacity: bigint
}
