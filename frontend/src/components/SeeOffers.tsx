import { Button, HStack, Text } from "@chakra-ui/react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogRoot,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { gql, request } from 'graphql-request'
import { useEffect, useState } from "react";
import { formatEther } from "viem";
import { useWriteContract } from "wagmi";
import ABI from "../../public/IdeaMarketplace.json";

const url = 'https://api.studio.thegraph.com/query/103524/proof-of-thought/version/latest'

interface PlacedOfferType {
  amount: string,
  blockNumber: string,
  blockTimestamp: string,
  offeror: string,
  tokenId: string,
  transactionHash: string
}

const SeeOffers = ({ tokenId }: { tokenId: string }) => {
  const { writeContract } = useWriteContract();
  const [offers, setOffers] = useState<PlacedOfferType[]>([]);

  const query = gql`query OffersForToken($tokenId: BigInt!) {
  offerPlaceds(where: { tokenId: $tokenId }) {
    tokenId
    offeror
    amount
    blockNumber
    blockTimestamp
    transactionHash
  }
}
`

  const { data } = useQuery<{ offerPlaceds: PlacedOfferType[] }>({
    queryKey: ['offers', tokenId],
    async queryFn() {
      return await request(url, query, { tokenId: parseInt(tokenId) })
    }
  })

  useEffect(() => {
    if (data) {
      setOffers(data.offerPlaceds)
    }
  }, [data])

  const acceptOffer = (offer: PlacedOfferType) => {
    writeContract({
      abi: ABI.abi,
      address: import.meta.env.VITE_SC_ADDRESS,
      functionName: "acceptOffer",
      args: [
        parseInt(tokenId),
        offer.offeror
      ]
    });
  }

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button variant="subtle" size="sm" bg="gray.500" color="white" w="min-content" p={2}>
          See Offer
        </Button>
      </DialogTrigger>
      <DialogContent bg="white">
        <DialogHeader>
          <DialogTitle>Available Offers</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {
            offers.map((offer) => (
              <>
                <HStack mt={4} p={4} borderWidth="1px" borderRadius="lg" overflow="hidden" justifyContent="space-between">
                  <div key={offer.transactionHash}>
                    <Text fontWeight="bold">Offeror: {offer.offeror.substring(0, 6)}...{offer.offeror.substring(offer.offeror.length - 4)}</Text>
                    <Text fontWeight="bold">Amount: {formatEther(BigInt(offer.amount))} ETH</Text>
                  </div>
                  <Button
                    colorScheme="green"
                    size="sm"
                    onClick={() => acceptOffer(offer)}
                  >
                    Accept Offer
                  </Button>
                </HStack>
              </>
            ))
          }
        </DialogBody>
        <DialogFooter justifyContent="space-between">
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default SeeOffers;
