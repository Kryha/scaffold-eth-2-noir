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
        <h1 className="text-3xl font-bold">Step 1: Town Hall 🏛 generates the signature 📜</h1>
        <p>
          Alice recognizes that, in order for her to not have to share her age with the balloon store, she at least has
          to share her age with a trusted third party. In this case, the balloon store has selected the Town Hall to be
          the trusted third party🏛. Alice accepts the fact that she has to share her age with the Town Hall.
        </p>
        <p>
          When the balloon store implemented their zero knowledge proof solution they made sure that they are using the
          same format as the Town Hall for constructing the claim that is being signed. In this project the claim
          construction for the Town Hall can be found in{" "}
          <a href="https://github.com/Kryha/scaffold-eth-2-noir/blob/main/packages/nextjs/pages/age-restricted-example/BirthDateSignature.tsx">
            <CodeText text="packages/nextjs/pages/age-restricted-example/BirthDateSignature.tsx" />
          </a>{" "}
          (
          <CodeText text="signBirthYear" />
          ).
        </p>
        <p>
          What the Town Hall actually signs is that they confirm that Alice is born in a certain year AND that she has
          control over a certain Ethereum address. The check of Alice&apos;s Ethereum address is not done in this
          example. The code for producing the signature currently includes the Town Hall&apos;s hardcoded private key.
          This can be improved in many ways, but at a minimum it should be the Towna Hall eployee that provides it to
          the UI.
        </p>
      </div>
      <div>
        <div className="card w-full shadow-2xl bg-base-100">
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
                <span className="label-text">Third party&apos;s🏛 private key for signing</span>
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
              <button className="btn btn-secondary mt-6" onClick={handleSubmission}>
                Sign birth year 📜
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
