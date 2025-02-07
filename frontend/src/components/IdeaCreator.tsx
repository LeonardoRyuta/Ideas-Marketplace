import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogRoot,
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

const pinata = config.pinata;

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

  const mintNFT = (ipfsHash: string) => {
    writeContract({
      abi:ABI.abi,
      address:import.meta.env.VITE_SC_ADDRESS,
      functionName:"mintIdea",
      args: [
        address,
        ipfsHash,
        {
          originality: 1,
          feasibility: 5,
          marketDemand: 3,
          complexity: 8,
          completeness: 10,
          technologyStack: 2,
          softwareRequirements: 5,
          algorithms: 5,
        },
      ]
    })
  }

  const handleSubmit = async () => {
    const { title, description, categories, image, content, owner } = ideaData;

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

    try {
      const upload = await pinata.upload.json(submittedIdea);
      console.log(upload);
      mintNFT(upload.IpfsHash);
    } catch (error) {
      console.log(error);
    }

    //upload the submitted idea to ipfs with pinata and get hash



    console.log("Idea submitted:", submittedIdea);
    // Here, send the data to your backend or blockchain
    // Optionally reset the form:
    // setIdeaData({
    //   title: "",
    //   description: "",
    //   categories: [],
    //   image: null,
    //   content: "",
    //   owner: "",
    // });
  };

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
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
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot >
  );
};

export default IdeaCreator;