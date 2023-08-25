import { useState } from "react";
import { ethers } from "ethers";
import secp256k1 from "secp256k1";
import { AddressInput } from "~~/components/scaffold-eth/Input/AddressInput";
import { useBirthYearProofsStore } from "~~/services/store/birth-year-proofs";

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
  const setSignedBirthYear = useBirthYearProofsStore(state => state.setSignedBirthYear);
  const setSignerPublicKey = useBirthYearProofsStore(state => state.setSignerPublicKey);

  const handleSubmission = async () => {
    const { signedMessage, signerPublicKey } = await signBirthYear(form);
    setSignedBirthYear(signedMessage);
    setSignerPublicKey(signerPublicKey);
  };

  return (
    <>
      <p className="py-6">
        {" "}
        Alice recognizes that, in order for her to not having to share her age with the balloon store, she at least has
        to share her age with a third party that the balloon store also can trust. In this case, the balloon store has
        selected the Town Hall to be the trusted third party🏛. Alice accepts that she has to share her age with the Town
        Hall.
        <br />
        When the balloon store implemented their zero knowledge proof solution they made sure that they are using the
        same format as the Town Hall for constructing the claim that is being signed📜.
        TTODOTODOTODOTODOTODOTODOTODOTODOTODOODO! In this project the claim construction can be found in{" "}
        <code className="italic bg-base-300 text-base font-bold">
          packages/nextjs/pages/example-zk/BirthDateSignature.tsx
        </code>
        (<code className="italic bg-base-300 text-base font-bold">signBirthYear</code>) and{" "}
        <code className="italic bg-base-300 text-base font-bold">
          packages/noir/circuits/LessThenSignedAge/src/main.nr
        </code>
        (<code className="italic bg-base-300 text-base font-bold">construct_claim_payload</code>).
        <br />
        What the Town Hall actually signs is that they confirm that Alice is born on a certain year AND that she has
        control over a certain Ethereum address. The check of Alice's Ethereum address is not done in this example.
        <br />
        The code for producing the signature currently includes the Town Hall's hardcoded private key. This can be
        improved in many ways, but at a minium it should be provided to the UI by a Town Hall employee.
        <br />
      </p>
      <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
        <div className="card-body">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Enter your Ethereum address</span>
            </label>
            <AddressInput
              value={form.personEthereumAddress}
              name="personEthereumAddress"
              placeholder="Ethereum address"
              onChange={(val: string) => setForm({ ...form, personEthereumAddress: val })}
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
              value={form.birthYear}
              onChange={e => setForm({ ...form, birthYear: e.target.value as unknown as number })}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Third party's🏛 private key for signing</span>
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
            <button className="btn btn-primary" onClick={handleSubmission}>
              Sign birth year 📜
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
