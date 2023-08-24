import { useState } from "react";
import { signBirthYear } from "../example-zk/BirthDateSignature";
import { parseForm } from "../example-zk/GenerateProof";
import { BigNumber } from "ethers";
import type { NextPage } from "next";
import { ParsedArgs, generateProof } from "~~/hooks/noir/useProofGenerator";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

const ExampleUI: NextPage = () => {
  const [signResult, setSignResult] = useState({
    signedMessage: "",
    signerPublicKey: "",
  });
  const [proof, setProof] = useState<string>("");
  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "BalloonVendor",
    functionName: "redeemFreeTokens",
    args: [proof as `0x${string}`],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
    overrides: {
      // TODO: is this needed?
      gasLimit: BigNumber.from("10000000"),
    },
  });

  const start = async () => {
    return signBirthYear({
      personEthereumAddress: "0x04cD158190d83Ef7E50d181c44AaFDb181a621b2",
      birthYear: 2014,
      theMayorsSecretKey: "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
    })
      .then(result => {
        console.log(result);
        setSignResult(result);
        const parsedForm = parseForm({
          birthYear: 2014,
          requiredBirthYear: 2013,
          proofOfBirthYearSignedMessage: result.signedMessage,
          proofOfBirthYearPublicKey: result.signerPublicKey,
          personEthereumAddress: "0x04cD158190d83Ef7E50d181c44AaFDb181a621b2",
        });
        return generateProof("LessThenSignedAge", parsedForm as ParsedArgs);
      })
      .then(result => {
        setProof(result.proof);
      });
  };
  const isProofRunning = signResult.signedMessage !== "" && proof === "";
  return (
    <>
      <div className="flex flex-col items-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => start()}
          disabled={isProofRunning || isLoading}
        >
          1. Generate Proof
        </button>
        <p className="break-words">
          Signed Message: {signResult.signedMessage === "" ? "waiting for start..." : signResult.signedMessage}
        </p>
        <p className="break-words">
          Signer Public Key: {signResult.signerPublicKey == "" ? "waiting for start..." : signResult.signerPublicKey}
        </p>
      </div>
      <div className="flex items-center">
        <p className="break-words">
          Proof: {proof === "" ? (isProofRunning ? "waiting for generation..." : "waiting for start...") : proof}
        </p>
      </div>
      <div className="flex flex-col items-center">
        {proof === "" ? (
          <p className="text-4xl font-bold">waiting for proof...</p>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => writeAsync()}
            disabled={isLoading}
          >
            2. Make contract call
          </button>
        )}
      </div>
    </>
  );
};

export default ExampleUI;
