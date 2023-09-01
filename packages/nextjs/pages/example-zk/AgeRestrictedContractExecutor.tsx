import { CodeText } from "./CodeText";
import SignedStats from "./SignedStats";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useBirthYearProofsStore } from "~~/services/store/birth-year-proofs";

export const AgeRestrictedContractExecutor = () => {
  const proof = useBirthYearProofsStore(state => state.proof);

  const { writeAsync, isLoading } = useScaffoldContractWrite({
    contractName: "BalloonVendor",
    functionName: "redeemFreeToken",
    args: [proof],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });

  return (
    <>
      <div className="flex-shrink-0 w-full max-w-5xl px-6 pb-6">
        <h1 className="text-3xl font-bold">Step 3: Getting the balloon🎈 NFT</h1>
        <p>
          The ballon store is using the same <CodeText text="TokenVendor.sol" /> contract as the{" "}
          <a className="link" href="https://speedrunethereum.com/challenge/token-vendor">
            Speedrun Ethereum challange
          </a>
          , with some additions. They&apos;ve added a function <CodeText text="redeemFreeToken" />, with the{" "}
          <CodeText text="onlyKids" />
          -modifier. The modifier constructs the public inputs and calls the proof-verifier (
          <CodeText text="packages/hardhat/contracts/verifiers/LessThanSignedAge.sol" />
          ). The public inputs are part of the information that was used to generate the proof. They are needed to show
          what we are actually proving.
        </p>
        <p>
          Now that Alice has received a balloon <strong>token</strong>, she can redeem that digital token at the store
          to get the actual ballloon.
        </p>
      </div>
      <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
        <SignedStats />
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Your proof of having the required birth year ✅</span>
            </label>
            <input
              type="text"
              placeholder="Proof of required birthyear"
              value={proof}
              className="input input-bordered"
            />
          </div>
          <button className="btn btn-primary mt-6" onClick={() => writeAsync()} disabled={isLoading}>
            Get free balloon 🎈
          </button>
        </div>
      </div>
    </>
  );
};
