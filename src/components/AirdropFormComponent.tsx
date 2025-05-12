"use client";

import { useEffect, useMemo, useState } from "react";
import InputField from "./ui/InputFields";
import { chainsToTSender, tsenderAbi, erc20Abi } from "../constants";
import {
  useChainId,
  useConfig,
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
  useSendTransaction,
  useReadContracts,
} from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import calculateTotalAmount from "@/utils/calculateTotal/calculateTotal";
import { toast } from "sonner";
// import { formatTokenAmount } from "@/utils/formatTokenAmount/formatTokenAmount";

export default function AirdropFormComponent() {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipientAddresses, setRecipientAddresses] = useState("");
  const [amounts, setAmounts] = useState("");
  const [hasEnoughTokens, setHasEnoughTokens] = useState(true);
  const chainId = useChainId();
  const config = useConfig();
  const account = useAccount();
  const totalAmount: number = useMemo(
    () => calculateTotalAmount(amounts),
    [amounts]
  );
  const { data: hash, isPending, writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      confirmations: 1,
      hash,
    });
  const { error } = useSendTransaction();
  const { data: tokenData } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "decimals",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "name",
      },
      {
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "balanceOf",
        args: [account.address],
      },
    ],
  });

  // ----------------------/** FUNCTION TO GET APPROVED AMOUNT */-----------------------------
  async function getApprovedAmount(
    tSenderAddress: string | null
  ): Promise<number> {
    if (!tSenderAddress) {
      alert(
        "No address found for current chain! Please switch to a supported chain."
      );
      return 0;
    }

    const response = await readContract(config, {
      abi: erc20Abi,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [account.address, tSenderAddress as `0x${string}`],
    });

    return response as number;
  }

  async function handleSubmit() {
    //If already approved, skip step 1 to step 2
    //Step1: Approve contract to transfer tokens
    //Step 2: Call airdrop function on the contract
    //Wait for transaction to be mined
    //Display success message??

    const tSenderAddress = chainsToTSender[chainId]["tsender"];
    const approvedAmount = await getApprovedAmount(tSenderAddress);

    console.log("approvedAmount", approvedAmount);

    if (approvedAmount < totalAmount) {
      const approvalHash = await writeContractAsync({
        abi: erc20Abi,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [tSenderAddress as `0x${string}`, BigInt(totalAmount)],
      });

      const transactionApprovalReceipt = await waitForTransactionReceipt(
        config,
        {
          hash: approvalHash,
        }
      );
      if (transactionApprovalReceipt.status !== "success") {
        toast("Approval failed!", {
          description: "Transaction failed. Please try again.",
          duration: 5000,
        });
      } else {
        toast("Amount approved!", {
          description: "Transaction successful. You can now airdrop tokens.",
          duration: 5000,
        });
      }

      console.log("Approval confirmed", transactionApprovalReceipt);

      // Step 2: Call airdrop function on the contract
      await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress,
          // Comma or new line separated
          recipientAddresses
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ""),
          amounts
            .split(/[,\n]+/)
            .map((amt) => amt.trim())
            .filter((amt) => amt !== ""),
          BigInt(totalAmount),
        ],
      });
      toast("Airdrop successful!", {
        description: `${amountTokens} tokens have been successfully airdropped.`,
        duration: 5000,
      });
      // add toasters for when user rejects transactions
    } else {
      //calling airdrop function erc20
      await writeContractAsync({
        abi: tsenderAbi,
        address: tSenderAddress as `0x${string}`,
        functionName: "airdropERC20",
        args: [
          tokenAddress,
          // Comma or new line separated
          recipientAddresses
            .split(/[,\n]+/)
            .map((addr) => addr.trim())
            .filter((addr) => addr !== ""),
          amounts
            .split(/[,\n]+/)
            .map((amt) => amt.trim())
            .filter((amt) => amt !== ""),
          BigInt(totalAmount),
        ],
      });
    }
  }

  const amountTokens: number = totalAmount / 10 ** 18;

  /** TO DISABLE BUTTON */
  function isDisabled(): boolean {
    if (!tokenAddress || !recipientAddresses || !amounts) {
      return true;
    }

    const recipientArray = recipientAddresses
      .split(/[,\n]+/)
      .map((addr) => addr.trim())
      .filter((addr) => addr !== "");

    const amountArray = amounts
      .split(/[,\n]+/)
      .map((amt) => amt.trim())
      .filter((amt) => amt !== "");

    if (recipientArray.length !== amountArray.length) {
      return true;
    }

    return false;
  }

  /** TO GET INPUT FIELDS FROM LOCAL STORAGE */
  useEffect(() => {
    const storedTokenAddress = localStorage.getItem("tokenAddress");
    const storedRecipientAddresses = localStorage.getItem("recipientAddresses");
    const storedAmounts = localStorage.getItem("amounts");

    if (storedTokenAddress) {
      setTokenAddress(storedTokenAddress);
    }
    if (storedRecipientAddresses) {
      setRecipientAddresses(storedRecipientAddresses);
    }
    if (storedAmounts) {
      setAmounts(storedAmounts);
    }
  }, []);

  /* SET INPUT FIELDS TO LOCAL STORAGE */
  useEffect(() => {
    localStorage.setItem("tokenAddress", tokenAddress);
  }, [tokenAddress]);

  useEffect(() => {
    localStorage.setItem("recipientAddresses", recipientAddresses);
  }, [recipientAddresses]);

  useEffect(() => {
    localStorage.setItem("amounts", amounts);
  }, [amounts]);

  useEffect(() => {
    if (
      tokenAddress &&
      totalAmount > 0 &&
      (tokenData?.[2]?.result as number) !== undefined
    ) {
      const userBalance = tokenData?.[2].result as number;
      setHasEnoughTokens(userBalance >= totalAmount);
    } else {
      setHasEnoughTokens(true);
    }
  }, [tokenAddress, totalAmount, tokenData]);

  /** TO RESET INPUT FILEDS UPON SUBMISSION */
  function resetInputFields() {
    setTokenAddress("");
    setRecipientAddresses("");
    setAmounts("");
  }

  return (
    <div className="p-20">
      <InputField
        label="Token Address"
        placeholder="0x.."
        value={tokenAddress}
        onChange={(e) => setTokenAddress(e.target.value)}
      />
      <InputField
        label="Recipients..."
        placeholder="0x...,0x...,0x..."
        value={recipientAddresses}
        large={true}
        onChange={(e) => setRecipientAddresses(e.target.value)}
      />
      <InputField
        label="Amounts..."
        placeholder="100,200,300..."
        value={amounts}
        large={true}
        onChange={(e) => setAmounts(e.target.value)}
      />
      <div className="w-full mx-auto p-4 border-1 mt-10 mb-8 rounded-2xl shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Transaction Details
        </h2>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600">
            <span className="font-medium">Token Name:</span>
            <span>{}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span className="font-medium">Amount (wei):</span>
            <span>{totalAmount}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span className="font-medium">Amount (tokens):</span>
            <span>{amountTokens >= 1 ** 18 ? amountTokens : null}.00</span>
            {/* <span className="font-mono text-zinc-900">
              {formatTokenAmount(totalAmount, tokenData?.[0]?.result as number)}
            </span> */}
          </div>
        </div>
      </div>
      <button
        onClick={() => {
          handleSubmit();
          resetInputFields();
        }}
        disabled={isDisabled() || isPending}
        className={`w-full py-2 px-4 rounded-lg shadow-md transition duration-200 ease-in-out font-semibold ${
          isDisabled() || isPending
            ? "bg-gray-400 text-gray-200 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isPending ? "Processing..." : "Send Tokens"}
      </button>
      {isConfirming && (
        <div className="mt-4">
          <p className="text-blue-600">Confirming transaction...</p>
        </div>
      )}
      {isConfirmed && (
        <div className="mt-4">
          <p className="text-green-600">
            Transaction confirmed! Check wallet for tokens.
          </p>
        </div>
      )}
      {error && (
        <div className="mt-4">
          <p className="text-red-600">
            Error: {(error as BaseError).shortMessage || error.message}
          </p>
        </div>
      )}
    </div>
  );
}
