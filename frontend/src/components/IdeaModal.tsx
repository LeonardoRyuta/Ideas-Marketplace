import { Button, Badge, HStack } from "@chakra-ui/react";
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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const scAddress = import.meta.env.VITE_SC_ADDRESS;

const IdeaModal = ({
  title,
  category,
  content,
  owner,
}: {
  title: string;
  description: string;
  category: string[];
  image: string;
  content: string;
  owner: string;
}) => {
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent bg="white" p={4} borderRadius="md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <HStack gap={2}>
            {category.map((cat) => (
              <Badge key={cat} colorScheme="purple">
                {cat}
              </Badge>
            ))}
          </HStack>
          <p>
            Owned by: {owner.slice(0, 6)}...{owner.slice(-4)}
          </p>
        </DialogHeader>
        <DialogBody>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default IdeaModal;
