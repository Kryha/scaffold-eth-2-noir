import { useState } from "react";
import { CodeText } from "./CodeText";
import { ethers } from "ethers";
import secp256k1 from "secp256k1";
import { AddressInput } from "~~/components/scaffold-eth/Input/AddressInput";
import { useBirthYearProofsStore } from "~~/services/store/birth-year-proofs";
import { notification } from "~~/utils/scaffold-eth";

// Hardcoded Trusted Third Party(TTP) private key
const THIRD_PARTY_PRIVATE_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

type TForm = {
  personEthereumAddress: string;
  birthYear: number;
  thirdPartyPrivateKey: string;
};

const getInitialFormState = (aliceDefaultAge: number): TForm => ({
  personEthereumAddress: "",
  birthYear: aliceDefaultAge,
  thirdPartyPrivateKey: THIRD_PARTY_PRIVATE_KEY,
});

// This function is called when the TTP 🏛 generates the signature 📜
export const signBirthYear = async (form: TForm) => {
  const { personEthereumAddress, birthYear, thirdPartyPrivateKey } = form;
  const claimHash = ethers.utils.solidityKeccak256(["address", "uint16"], [personEthereumAddress, birthYear]);

  const privateKey = ethers.utils.arrayify(thirdPartyPrivateKey);
  const sigObj = secp256k1.ecdsaSign(ethers.utils.arrayify(claimHash), privateKey);

  const publicKey = secp256k1.publicKeyCreate(privateKey, false);

  return {
    signedMessage: ethers.utils.hexlify(sigObj.signature),
    signerPublicKey: ethers.utils.hexlify(publicKey),
  };
};

export const BirthDateSignature = ({ aliceDefaultAge }: { aliceDefaultAge: number }) => {
  const [form, setForm] = useState<TForm>(() => getInitialFormState(aliceDefaultAge));
  const ethereumAddress = useBirthYearProofsStore(state => state.ethereumAddress);
  const setEthereumAddress = useBirthYearProofsStore(state => state.setEthereumAddress);
  const birthYear = useBirthYearProofsStore(state => state.birthYear);
  const setBirthYear = useBirthYearProofsStore(state => state.setBirthYear);
  const setSignedBirthYear = useBirthYearProofsStore(state => state.setSignedBirthYear);
  const setSignerPublicKey = useBirthYearProofsStore(state => state.setSignerPublicKey);

  const handleSubmission = async () => {
    try {
      const { signedMessage, signerPublicKey } = await signBirthYear({
        ...form,
        personEthereumAddress: ethereumAddress,
        birthYear,
      });
      setSignedBirthYear(signedMessage);
      setSignerPublicKey(signerPublicKey);
      notification.success("Successfully signed birth year");
    } catch (e) {
      notification.error("Something went wrong");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold">Step 1: Town Hall 🏛 signs 📜 the birth date</h1>
        <p>
          <strong>Alice</strong> and the <strong>Balloon Store</strong> need to agree on who to trust in order to
          certify Alice&apos; age. In this example the <strong>Town Hall</strong> acts as a trusted third party, but in
          a different set-up the certifying entity could be completely different. The only requirement is that both
          Alice & the Ballon Store trust the signature (certification) provided by this third party.
        </p>
        <p>
          The Ballon Store has implemented the same claim format as the Town Hall, this enables the proof verification
          on a later step. You can find the construction of this claim here:{" "}
          <a href="https://github.com/Kryha/scaffold-eth-2-noir/blob/main/packages/nextjs/pages/age-restricted-example/BirthDateSignature.tsx">
            <CodeText text="packages/nextjs/pages/age-restricted-example/BirthDateSignature.tsx" />
          </a>{" "}
          (
          <CodeText text="signBirthYear" />
          ).
        </p>
        <p>
          Using it&apos;s <strong>private key</strong>, the <strong>Town Hall</strong> is actually signing the
          confirmation that <strong>Alice</strong> was born in a given year <strong>AND</strong> that she has control
          over certain Ethereum <strong>address</strong>.
        </p>
      </div>
      <div>
        <div className="card w-full shadow-2xl bg-base-300">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter your Ethereum address</span>
              </label>
              <AddressInput
                value={ethereumAddress}
                name="personEthereumAddress"
                placeholder="Ethereum address"
                onChange={(value: string) => setEthereumAddress(value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Enter your birth year</span>
              </label>
              <input
                type="number"
                placeholder="Birth year"
                className="input input-bordered"
                value={birthYear}
                onChange={e => setBirthYear(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Third party&apos;s 🏛 private key for signing</span>
              </label>
              <input
                type="text"
                placeholder="Super secret key"
                value={form.thirdPartyPrivateKey}
                className="input input-bordered"
                onChange={e => setForm({ ...form, thirdPartyPrivateKey: e.target.value })}
              />
            </div>
            <div className="form-control">
              <button className="btn btn-primary mt-6" onClick={handleSubmission}>
                Sign birth year 📜
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
