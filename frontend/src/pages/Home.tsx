import { SimpleGrid, Heading, Container, HStack } from "@chakra-ui/react";
import { IdeaCard, IdeaCreator } from "@/components"

const ideas = [
  {
    id: 1,
    title: "Decentralized Social Network",
    description: "A censorship-resistant social media platform built on blockchain.",
    category: ["Social", "Web3", "Decentralization"],
    image: "https://placehold.co/300x200",
    content: `## **Overview**

This project aims to create a decentralized social network that protects user privacy and resists censorship.  

### Key Features
- **User Ownership:** Every user owns their data.
- **Decentralized Moderation:** Community-driven content moderation.
- **Interoperability:** Seamless integration with other decentralized platforms.

[Learn More](https://example.com)
    `,
    owner: "0xAbC1234567890abcdef1234567890AbC12345"
  },
  {
    id: 2,
    title: "AI-Powered DAO",
    description: "A DAO that leverages AI to automate decision making and governance.",
    category: ["DAO", "AI", "Governance"],
    image: "https://placehold.co/300x200",
    content: `
# AI-Powered DAO 🤖

## Summary
An autonomous DAO that uses AI agents to propose, evaluate, and execute governance decisions.

## Features
- **Automated Proposals:** AI agents generate proposals based on data.
- **Data-Driven Voting:** Smart contracts process and execute community votes.
- **Scalable Governance:** Adaptable to projects of all sizes.

[View Documentation](https://example.com)
    `,
    owner: "0xDeF9876543210fedcba9876543210DeF98765"
  },
  {
    id: 3,
    title: "Blockchain Voting System",
    description: "A secure and transparent voting system for decentralized communities.",
    category: ["Voting", "Security", "Blockchain"],
    image: "https://placehold.co/300x200",
    content: `
## Blockchain Voting System

### Introduction
A voting platform that leverages blockchain technology to ensure security and transparency in elections.

### Benefits
- **Immutable Records:** Every vote is recorded permanently on the blockchain.
- **Transparency:** Publicly verifiable vote counts.
- **Security:** Resistant to tampering and fraud.

**Get Involved:**  
Contact us to join the beta testing phase.
    `,
    owner: "0x1234567890abcdef1234567890abcdef12345678"
  }
];

function Home() {
  return (
    <Container maxW="6xl" py={10}>
      <HStack gap={4} mb={6} justify="space-between" alignItems="center">
        <Heading as="h1" size="xl">
          Explore Ideas
        </Heading>

        <IdeaCreator />
      </HStack>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {ideas.map((idea) => (
          <IdeaCard key={idea.id} {...idea} />
        ))}
      </SimpleGrid>
    </Container>
  )
}

export default Home
