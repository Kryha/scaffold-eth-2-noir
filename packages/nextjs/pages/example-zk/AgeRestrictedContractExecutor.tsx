import { useState } from "react";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

type TProof = `0x${string}`;

export const AgeRestrictedContractExecutor = () => {
  const [proof, setProof] = useState<TProof>("0x");

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "BalloonVendor",
    functionName: "redeemFreeTokens",
    args: [proof],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <p>Call age restricted contract with proof here. Copy/paste from prev window.</p>
        <input
          type="text"
          placeholder="proof-of-required-birthyear"
          value={proof}
          onChange={e => setProof(e.target.value as TProof)}
        />
        <button className="border-2 border-black" onClick={() => writeAsync()} disabled={isLoading}>
          Call age restricted contract with proof
        </button>
      </div>
    </>
  );
};
