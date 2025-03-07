import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogRoot
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  Input,
  Textarea,
  Button,
  Fieldset,
  createListCollection
} from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
} from "@/components/ui/select"
import { config, types } from "../utils";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-upload"
import { HiCamera } from "react-icons/hi"
import { useWriteContract, useAccount } from "wagmi";
import ABI from "../../public/IdeaMarketplace.json";
import { toaster } from "@/components/ui/toaster"

const pinata = config.pinata;
const serverURL = "https://ideas-marketplace.onrender.com";

const categoryOptions = createListCollection({
  items: [
    { label: "Social", value: "social" },
    { label: "DAO", value: "dao" },
    { label: "Governance", value: "governance" },
    { label: "Voting", value: "voting" },
    { label: "Security", value: "security" },
    { label: "Blockchain", value: "blockchain" },
  ],
});


const IdeaCreator = () => {
  const { address } = useAccount();
  const { writeContract } = useWriteContract()
  const [ideaData, setIdeaData] = useState({
    title: "",
    description: "",
    categories: [] as string[],
    image: new File([""], "filename"),
    content: "",
    owner: "",
  });
  const [dialogOpen, setDialogOpen] = useState(false);

  const mintNFT = (ipfsHash: string, scores: types.Scores) => {
    console.log("Minting NFT with IPFS hash:", ipfsHash);
    writeContract({
      abi:ABI.abi,
      address:import.meta.env.VITE_SC_ADDRESS,
      functionName:"mintIdea",
      args: [
        address,
        ipfsHash,
        scores
      ]
    })
  }

  const handleSubmit = async () => {
    const { title, description, categories, image, content, owner } = ideaData;

    toaster.create({
      description: "Submitting idea...",
      duration: 3000
    })

    setDialogOpen(false);

    let ipfsHash = "";

    try {
      const upload = await pinata.upload.file(image!);
      console.log(upload);
      ipfsHash = upload.IpfsHash;
    } catch (error) {
      console.log(error);
    }

    const submittedIdea: types.IdeaMetadata = {
      title,
      description,
      categories,
      ipfsHash,
      content,
      owner
    };

    const body = JSON.stringify({
      "title": submittedIdea.title,
      "description": submittedIdea.description + " " + submittedIdea.content,
    });

    console.log(body);
    const response = await fetch(`${serverURL}/scoring/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: body,
    });
    
    const data = await response.json();

    console.log("Data:", data);

    const scores = data.idea.ai_score.originality ? data.idea.ai_score : {   originality: 5,
      feasibility: 8,
      marketDemand: 5,
      complexity: 5,
      completeness: 7,
    } // added static scores in case it doesnt work for the demo

    console.log("Scores:", scores); 

    try {
      const upload = await pinata.upload.json(submittedIdea);
      console.log(upload);
      mintNFT(upload.IpfsHash, scores);
    } catch (error) {
      console.log(error);
    }

    console.log("Idea submitted:", submittedIdea);

    setIdeaData({
      title: "",
      description: "",
      categories: [],
      image: new File([""], "filename"),
      content: "",
      owner: "",
    });
  };

  return (
    <DialogRoot open={dialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
          Create Idea
        </Button>
      </DialogTrigger>
      <DialogContent bg="white" p={4} borderRadius="md">
        <DialogHeader>
          <DialogTitle>Upload your idea</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Fieldset.Root size="lg" maxW="md">
            <Fieldset.Content>
              <Field label="Title">
                <Input name="title" onChange={(e) => setIdeaData({ ...ideaData, title: e.target.value })} />
              </Field>

              <Field label="Description">
                <Input name="description" onChange={(e) => setIdeaData({ ...ideaData, description: e.target.value })} />
              </Field>

              <Field label="Categories">
                <SelectRoot collection={categoryOptions} size="sm" width="320px" multiple onValueChange={(details) => setIdeaData({ ...ideaData, categories: details.value })}>
                  <SelectTrigger>
                    <SelectValueText placeholder="Select categories" />
                  </SelectTrigger>
                  <SelectContent portalled={false}>
                    {categoryOptions.items.map((category) => (
                      <SelectItem item={category} key={category.value} color="white">
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </SelectRoot>
              </Field>

              <Field label="Image Upload">
                <FileUploadRoot accept={["image/*"]} onFileAccept={(file) => setIdeaData({ ...ideaData, image: file.files[0] })}>
                  <FileUploadTrigger asChild>
                    <Button variant="outline" size="sm">
                      <HiCamera /> Upload Image
                    </Button>
                  </FileUploadTrigger>
                  <FileUploadList />
                </FileUploadRoot>
              </Field>

              <Field label="Content">
                <Textarea name="content" onChange={(e) => setIdeaData({ ...ideaData, content: e.target.value })} />
              </Field>
            </Fieldset.Content>

            <Button onClick={handleSubmit} type="submit" alignSelf="flex-start">
              Submit
            </Button>
          </Fieldset.Root>
        </DialogBody>
        <DialogCloseTrigger onClick={() => setDialogOpen(false)} />
      </DialogContent>
    </DialogRoot >
  );
};

export default IdeaCreator;