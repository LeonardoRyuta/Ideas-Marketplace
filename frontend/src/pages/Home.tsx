import { SimpleGrid, Heading, Container, HStack } from "@chakra-ui/react";
import { IdeaCard, IdeaCreator } from "@/components"
import { useQuery } from '@tanstack/react-query'
import { gql, request } from 'graphql-request'
import { useEffect, useState } from "react";
import { types } from "@/utils";

const query = gql`{
  ideaMinteds(first: 100) {
    tokenId
    creator
    metadataURI
    blockNumber
    blockTimestamp
    transactionHash
  }
}`

const url = 'https://api.studio.thegraph.com/query/103524/proof-of-thought/version/latest'

// const scAddress = import.meta.env.VITE_SC_ADDRESS;

function Home() {
  const [ideas, setIdeas] = useState<types.IdeaProps[]>([])

  const { data } = useQuery<types.DataType>({
    queryKey: ['data'],
    async queryFn() {
      return await request(url, query)
    }
  })

  useEffect(() => {
    if (data) {
      setIdeas(data.ideaMinteds)
    }
  }, [data])

  return (
    <Container maxW="6xl" py={10}>
      {/* <main>
        {status === 'pending' ? <div>Loading...</div> : null}
        {status === 'error' ? <div>Error ocurred querying the Subgraph</div> : null}
        <div>{JSON.stringify(data ?? {})}</div>
      </main> */}
      <HStack gap={4} mb={6} justify="space-between" alignItems="center">
        <Heading as="h1" size="xl">
          Explore Ideas
        </Heading>

        <IdeaCreator />
      </HStack>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {ideas?.map((idea) => (
          <IdeaCard key={idea.tokenId} idea={idea}/>
        ))}
      </SimpleGrid>
    </Container>
  )
}

export default Home
