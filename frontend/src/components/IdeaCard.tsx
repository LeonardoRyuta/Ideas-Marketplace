import { Box, Image, Text, Badge, VStack, HStack } from "@chakra-ui/react";
import IdeaModal from "./IdeaModal";
import Offer from "./Offer";
import { types } from "@/utils";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import SeeOffers from "./SeeOffers";
import { useReadContract } from "wagmi";
import ABI from "../../public/IdeaMarketplace.json";

const IdeaCard = ({ idea }: { idea: types.IdeaProps }) => {
  const { address } = useAccount();
  const [isOwner, setIsOwner] = useState(false);
  const [ideaMetadata, setIdeaMetadata] = useState<types.IdeaMetadata>({
    title: "",
    description: "",
    categories: [],
    content: "",
    ipfsHash: "",
    owner: ""
  });
  const [scores, setScores] = useState<types.Scores>({
    originality: 0,
    feasibility: 0,
    marketDemand: 0,
    complexity: 0,
    completeness: 0
  });

  const getIdeaOwner = useReadContract({
    abi: ABI.abi,
    address: import.meta.env.VITE_SC_ADDRESS,
    functionName: "ownerOf",
    args: [idea.tokenId],
  })

  const getIdeaScores = useReadContract({
    abi: ABI.abi,
    address: import.meta.env.VITE_SC_ADDRESS,
    functionName: "getScores",
    args: [idea.tokenId],
  })

  useEffect(() => {
    if (getIdeaScores.data && Array.isArray(getIdeaScores.data)) {
      const dataArray = getIdeaScores.data as unknown as number[];
      setScores({
        originality: dataArray[0],
        feasibility: dataArray[1],
        marketDemand: dataArray[2],
        complexity: dataArray[3],
        completeness: dataArray[4]
      });
    }
  }, [getIdeaScores.data]);

  useEffect(() => {
    if (getIdeaOwner.data) {
      const ideaOwner = getIdeaOwner.data as string;
      console.log(ideaOwner);

      if (address && ideaOwner === address.toLowerCase()) {
        setIsOwner(true);
      }

      (async () => {
        const file = await fetch(`https://ipfs.io/ipfs/${idea.metadataURI}`).then((res) => res.json());

        setIdeaMetadata({
          title: file.title,
          description: file.description,
          categories: file.categories,
          content: file.content,
          ipfsHash: file.ipfsHash,
          owner: ideaOwner
        });

        console.log(file);
      })();
    }
  }, [getIdeaOwner.data]);

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      p={4}
      bg="white"
    >
      <Image src={`https://ipfs.io/ipfs/${ideaMetadata?.ipfsHash}`} alt={ideaMetadata?.title} borderRadius="md" />
      <VStack align="start" gap={2} mt={4}>
        <HStack>
          {ideaMetadata?.categories.map((cat) => (
            <Badge key={cat} colorScheme="purple">
              {cat}
            </Badge>
          ))}
        </HStack>
        <Text fontWeight="bold" fontSize="xl">
          {ideaMetadata?.title}
        </Text>
        <Text fontSize="sm" color="gray.600" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {ideaMetadata?.description}
        </Text>
        <Text fontSize="xs" color="gray.500">
          Owned by: {ideaMetadata?.owner.slice(0, 6)}...{ideaMetadata?.owner.slice(-4)}
        </Text>
        <HStack justify="space-between" w="full">
          <IdeaModal title={ideaMetadata?.title} description={ideaMetadata?.description} categories={ideaMetadata?.categories} ipfsHash={ideaMetadata?.ipfsHash} content={ideaMetadata?.content} owner={ideaMetadata?.owner} scores={scores} />
          {
            isOwner ?
              <SeeOffers tokenId={idea.tokenId} />
              :
              <Offer tokenId={idea.tokenId} />

          }
        </HStack>
      </VStack>
    </Box>
  );
};

export default IdeaCard;
