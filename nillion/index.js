import { SecretVaultWrapper } from 'nillion-sv-wrappers';
import { v4 as uuidv4 } from 'uuid';
import { orgConfig } from './nillionOrgConfig.js';

const SCHEMA_ID = '03db17e3-0a99-44a8-9f82-90d04752416d';

const data = [
  {
    title: "AI-Powered Resume Optimizer",
    description: "An AI-powered SaaS platform that helps users optimize their resumes for better job opportunities.",
    ipfsHash: "bafkreiczbwgzu3uflu26zgkf7lmzazmqacqzfltzi6h3tknr2x7mbum5xi",
    categories: ["social"],
    content: {
      $allot: "The system uses a combination of Natural Language Processing (NLP) and Machine Learning (ML) to analyze resume structure, keyword relevance, readability, and ATS (Applicant Tracking System) compatibility. Technology Stack: Backend: FastAPI (Python), Frontend: React.js, Database: PostgreSQL (for storing user resumes and feedback history). Core Features & Algorithms: NLP Analysis: Uses OpenAI's GPT-4 API and spaCy for keyword optimization. ML Scoring System: Trained using a dataset of high-ranking resumes from LinkedIn and Indeed job postings. ATS Compatibility Checker: Uses regex-based parsing and LSTM models to assess how well a resume aligns with ATS filters. Feedback Generation: The AI suggests improvements based on industry best practices using a rule-based scoring algorithm. Implementation Details: Users upload their resume (PDF, DOCX). The system extracts key sections (Experience, Education, Skills, etc.) using spaCy. The AI assigns scores for readability, structure, and keyword optimization. The system provides tailored recommendations and allows users to tweak resumes in real-time via an interactive editor. Results are stored in PostgreSQL for tracking and improvement history. APIs & Integrations: Uses OpenAI API for advanced text analysis. LinkedIn API integration for personalized job recommendations. Stripe API for subscription-based access to premium resume optimization tools. AWS S3 for secure resume storage. Security & Scalability: JWT-based authentication for secure access. Data encryption using AES-256 for storing sensitive information. Deployed on AWS Lambda for scalability and cost efficiency. Uses WebSockets for real-time resume scoring updates."
    }
  },
];

async function main() {
  try {
    // Create a secret vault wrapper and initialize the SecretVault collection to use
    const collection = new SecretVaultWrapper(
      orgConfig.nodes,
      orgConfig.orgCredentials,
      SCHEMA_ID
    );
    await collection.init();

    // Write collection data to nodes encrypting the specified fields ahead of time
    const dataWritten = await collection.writeToNodes(data);
    console.log(
      '👀 Data written to nodes:',
      JSON.stringify(dataWritten, null, 2)
    );

    // Get the ids of the SecretVault records created
    const newIds = [
      ...new Set(dataWritten.map((item) => item.result.data.created).flat()),
    ];
    console.log('uploaded record ids:', newIds);

    // Read all collection data from the nodes, decrypting the specified fields
    const decryptedCollectionData = await collection.readFromNodes({});

    // Log first 5 records
    console.log(
      'Most recent records',
      decryptedCollectionData.slice(0, data.length)
    );
  } catch (error) {
    console.error('❌ SecretVaultWrapper error:', error.message);
    process.exit(1);
  }
}

main();