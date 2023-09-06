import { useState } from "react";
import { CodeText } from "./CodeText";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useBirthYearProofsStore } from "~~/services/store/birth-year-proofs";

export const BalloonCount = (props: { sender: string }) => {
  const { data } = useScaffoldContractRead({
    contractName: "BalloonToken",
    functionName: "balanceOf",
    args: [props.sender],
  });

  if (data?.toString()) {
    return <p>Balloon count: {data?.toString()}</p>;
  }

  return <></>;
};

export const AgeRestrictedContractExecutor = () => {
  const proof = useBirthYearProofsStore(state => state.proof);
  const setProof = useBirthYearProofsStore(state => state.setProof);
  const [sender, setSender] = useState("");

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "BalloonVendor",
    functionName: "getFreeToken",
    args: [proof],
    onBlockConfirmation: txnReceipt => {
      setSender(txnReceipt.from);
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <div className="grid grid-cols-2 gap-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold">Step 3: Getting the balloon 🎈</h1>
        <p>
          The ballon store is using the same <CodeText text="TokenVendor.sol" /> contract as the{" "}
          <a className="link" href="https://speedrunethereum.com/challenge/token-vendor">
            Speedrun Ethereum challange
          </a>
          , with some additions. They&apos;ve added a function <CodeText text="getFreeToken" />, with the{" "}
          <CodeText text="onlyKids" />
          -modifier. This implementation can be found in{" "}
          <a href="https://github.com/Kryha/scaffold-eth-2-noir/blob/main/packages/hardhat/contracts/BalloonVendor.sol">
            <CodeText text="packages/hardhat/contracts/BalloonVendor.sol" />
          </a>{" "}
          in our project.
          <br />
          The modifier constructs the public inputs and calls the proof-verifier in (
          <a href="https://github.com/Kryha/scaffold-eth-2-noir/blob/main/packages/hardhat/contracts/verifiers/LessThanSignedAge.sol">
            <CodeText text="packages/hardhat/contracts/verifiers/LessThanSignedAge.sol" />
          </a>
          ). The public inputs is part of the information that was used to generate the proof. They are needed to show
          what we are actually proving.
        </p>
        <p>
          Now that Alice has received a balloon <strong>token</strong>, she can redeem that digital token at the store
          to get the actual ballloon.
        </p>
      </div>
      <div>
        <div className="card w-full shadow-2xl bg-base-300">
          <div className="card-body">
            <BalloonCount sender={sender} />
            <div className="form-control">
              <label className="label">
                <span className="label-text">Your proof of having the required birth year ✅</span>
              </label>
              <input
                type="text"
                placeholder="Proof of required birthyear"
                value={proof}
                className="input input-bordered"
                onChange={e => setProof(e.target.value as `0x${string}`)}
              />
            </div>
            <button className="btn btn-primary mt-6" onClick={() => writeAsync()} disabled={isLoading}>
              Get balloon 🎈
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};