import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  BatchMetadataUpdate,
  IdeaMinted,
  MetadataUpdate,
  OfferAccepted,
  OfferPlaced,
  OfferWithdrawn,
  OwnershipTransferred,
  ScoresSet,
  Transfer
} from "../generated/IdeaMarketplace/IdeaMarketplace"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBatchMetadataUpdateEvent(
  _fromTokenId: BigInt,
  _toTokenId: BigInt
): BatchMetadataUpdate {
  let batchMetadataUpdateEvent = changetype<BatchMetadataUpdate>(newMockEvent())

  batchMetadataUpdateEvent.parameters = new Array()

  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_fromTokenId",
      ethereum.Value.fromUnsignedBigInt(_fromTokenId)
    )
  )
  batchMetadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_toTokenId",
      ethereum.Value.fromUnsignedBigInt(_toTokenId)
    )
  )

  return batchMetadataUpdateEvent
}

export function createIdeaMintedEvent(
  tokenId: BigInt,
  creator: Address,
  metadataURI: string
): IdeaMinted {
  let ideaMintedEvent = changetype<IdeaMinted>(newMockEvent())

  ideaMintedEvent.parameters = new Array()

  ideaMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  ideaMintedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  ideaMintedEvent.parameters.push(
    new ethereum.EventParam(
      "metadataURI",
      ethereum.Value.fromString(metadataURI)
    )
  )

  return ideaMintedEvent
}

export function createMetadataUpdateEvent(_tokenId: BigInt): MetadataUpdate {
  let metadataUpdateEvent = changetype<MetadataUpdate>(newMockEvent())

  metadataUpdateEvent.parameters = new Array()

  metadataUpdateEvent.parameters.push(
    new ethereum.EventParam(
      "_tokenId",
      ethereum.Value.fromUnsignedBigInt(_tokenId)
    )
  )

  return metadataUpdateEvent
}

export function createOfferAcceptedEvent(
  tokenId: BigInt,
  seller: Address,
  buyer: Address,
  salePrice: BigInt
): OfferAccepted {
  let offerAcceptedEvent = changetype<OfferAccepted>(newMockEvent())

  offerAcceptedEvent.parameters = new Array()

  offerAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  offerAcceptedEvent.parameters.push(
    new ethereum.EventParam("seller", ethereum.Value.fromAddress(seller))
  )
  offerAcceptedEvent.parameters.push(
    new ethereum.EventParam("buyer", ethereum.Value.fromAddress(buyer))
  )
  offerAcceptedEvent.parameters.push(
    new ethereum.EventParam(
      "salePrice",
      ethereum.Value.fromUnsignedBigInt(salePrice)
    )
  )

  return offerAcceptedEvent
}

export function createOfferPlacedEvent(
  tokenId: BigInt,
  offeror: Address,
  amount: BigInt
): OfferPlaced {
  let offerPlacedEvent = changetype<OfferPlaced>(newMockEvent())

  offerPlacedEvent.parameters = new Array()

  offerPlacedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  offerPlacedEvent.parameters.push(
    new ethereum.EventParam("offeror", ethereum.Value.fromAddress(offeror))
  )
  offerPlacedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return offerPlacedEvent
}

export function createOfferWithdrawnEvent(
  tokenId: BigInt,
  offeror: Address
): OfferWithdrawn {
  let offerWithdrawnEvent = changetype<OfferWithdrawn>(newMockEvent())

  offerWithdrawnEvent.parameters = new Array()

  offerWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  offerWithdrawnEvent.parameters.push(
    new ethereum.EventParam("offeror", ethereum.Value.fromAddress(offeror))
  )

  return offerWithdrawnEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createScoresSetEvent(
  tokenId: BigInt,
  originality: i32,
  feasibility: i32,
  marketDemand: i32,
  complexity: i32,
  completeness: i32,
  technologyStack: i32,
  softwareRequirements: i32,
  algorithms: i32
): ScoresSet {
  let scoresSetEvent = changetype<ScoresSet>(newMockEvent())

  scoresSetEvent.parameters = new Array()

  scoresSetEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  scoresSetEvent.parameters.push(
    new ethereum.EventParam(
      "originality",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(originality))
    )
  )
  scoresSetEvent.parameters.push(
    new ethereum.EventParam(
      "feasibility",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(feasibility))
    )
  )
  scoresSetEvent.parameters.push(
    new ethereum.EventParam(
      "marketDemand",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(marketDemand))
    )
  )
  scoresSetEvent.parameters.push(
    new ethereum.EventParam(
      "complexity",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(complexity))
    )
  )
  scoresSetEvent.parameters.push(
    new ethereum.EventParam(
      "completeness",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(completeness))
    )
  )
  scoresSetEvent.parameters.push(
    new ethereum.EventParam(
      "technologyStack",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(technologyStack))
    )
  )
  scoresSetEvent.parameters.push(
    new ethereum.EventParam(
      "softwareRequirements",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(softwareRequirements))
    )
  )
  scoresSetEvent.parameters.push(
    new ethereum.EventParam(
      "algorithms",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(algorithms))
    )
  )

  return scoresSetEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}
