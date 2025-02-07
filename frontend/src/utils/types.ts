interface IdeaProps {
  tokenId: string
  creator: string
  metadataURI: string
  blockNumber: string
  blockTimestamp: string
  transactionHash: string
}

interface DataType {
  ideaMinteds: IdeaProps[]
}

interface IdeaMetadata {
  title: string,
  description: string,
  ipfsHash: string,
  categories: string[],
  content: string
  owner: string,
}

interface Scores{
  originality: number,
  feasibility: number,
  marketDemand: number,
  complexity: number,
  completeness: number,
  technologyStack: number,
  softwareRequirements: number,
  algorithms: number
}

export type {
  IdeaProps,
  DataType,
  IdeaMetadata,
  Scores
}