import { Button, Badge, HStack, Stat, Wrap } from "@chakra-ui/react";
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

interface IdeaModalProps extends types.IdeaMetadata {
  scores: types.Scores;
}

const IdeaModal: React.FC<IdeaModalProps> = ({
  title,
  categories,
  content,
  owner,
  scores,
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
          <Wrap gap="4" justify="center">
            {Object.entries(scores).map(([category, score]) => (
              <Stat.Root key={category} p="2" borderWidth="1px" borderRadius="lg" boxShadow="sm">
                <Stat.Label fontWeight="medium" color="gray.600">{category}</Stat.Label>
                <Stat.ValueText fontSize="2xl" color="gray.800">{score}/10</Stat.ValueText>
              </Stat.Root>
            ))}
          </Wrap>
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
