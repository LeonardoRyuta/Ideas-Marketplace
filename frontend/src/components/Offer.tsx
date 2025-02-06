import { Button } from "@chakra-ui/react";
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
import { NumberInputField, NumberInputRoot } from "@/components/ui/number-input";
import { useWriteContract } from 'wagmi'
import ABI from "../../public/IdeaMarketplace.json";
import { useState } from "react";
import { parseEther } from "viem";

const Offer = ({tokenId} : {tokenId: string}) => {
  const { writeContract } = useWriteContract();
  const [amount, setAmount] = useState(0.05);

  const placeOffer = () => {
    writeContract({
      abi: ABI.abi,
      address:import.meta.env.VITE_SC_ADDRESS,
      functionName:"placeOffer",
      args: [
        tokenId
      ],
      value: parseEther(amount.toString())
    });
  }

  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <Button variant="subtle" size="sm" bg="gray.500" color="white" w="min-content" p={2}>
          Make Offer
        </Button>
      </DialogTrigger>
      <DialogContent bg="white">
        <DialogHeader>
          <DialogTitle>Make an offer for the idea</DialogTitle>
        </DialogHeader>
        <DialogBody>
          <p>Enter the amount of ETH you would like to offer for this idea</p>
          <NumberInputRoot
            defaultValue="0.05"
            min={0}
            step={0.01}
            size="sm"
            onValueChange={(value) => setAmount(value.valueAsNumber)}
          >
            <NumberInputField />
          </NumberInputRoot>

        </DialogBody>
        <DialogFooter justifyContent="space-between">
          <Button bg="green.600" onClick={placeOffer}>Submit Offer</Button>
          <DialogActionTrigger asChild>
            <Button variant="outline">Cancel</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

export default Offer;
