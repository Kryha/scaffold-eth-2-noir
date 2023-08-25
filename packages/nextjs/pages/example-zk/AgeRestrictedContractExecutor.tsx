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
      <p className="py-6">
        {" "}
        The ballon store is using the same `TokenVendor.sol` as the [speed run Ethereum
        challange](https://speedrunethereum.com/challenge/token-vendor), with some additions. They've added a function
        `redeemFreeToken`, with the `onlyKids`-modifier. The modifier constructs the public inputs and calls the
        proof-verifier (`packages/hardhat/contracts/verifiers/LessThenSignedAge.sol`). The public inputs is part of the
        information that was used to generate the proof. They are needed to show what we are actually proving.
        <br />
        Now Alice gets a balloon🎈 _token_, that she can redeem at the store to get an actual ballloon.
        <br />
      </p>
      <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Your proof of having the required birth year</span>
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
