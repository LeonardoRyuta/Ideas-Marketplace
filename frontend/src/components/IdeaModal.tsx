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
import { types } from "@/utils";

const IdeaModal = ({
  title,
  categories,
  content,
  owner,
}: types.IdeaMetadata) => {
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
            {categories.map((cat) => (
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
