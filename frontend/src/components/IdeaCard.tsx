import { Box, Image, Text, Badge, VStack, HStack } from "@chakra-ui/react";
import IdeaModal from "./IdeaModal";

const IdeaCard = ({ title, description, category, image, content, owner }: { title: string, description: string, category: string[], image: string, content: string, owner: string }) => {
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
      <Image src={image || "/placeholder.png"} alt={title} borderRadius="md" />
      <VStack align="start" gap={2} mt={4}>
        <HStack>
          {category.map((cat) => (
            <Badge key={cat} colorScheme="purple">
              {cat}
            </Badge>
          ))}
        </HStack>
        <Text fontWeight="bold" fontSize="xl">
          {title}
        </Text>
        <Text fontSize="sm" color="gray.600" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {description}
        </Text>
        <Text fontSize="xs" color="gray.500">
          Owned by: {owner.slice(0, 6)}...{owner.slice(-4)}
        </Text>
        {/* <Button colorScheme="blue" w="full" mt={2}>
          View Details
        </Button> */}
        <IdeaModal title={title} description={description} category={category} image={image} content={content} owner={owner} />
      </VStack>
    </Box>
  );
};

export default IdeaCard;
