import { useState } from "react";
import { ethers } from "ethers";
import secp256k1 from "secp256k1";
import { AddressInput } from "~~/components/scaffold-eth/Input/AddressInput";
import { useBirthYearProofsStore } from "~~/services/store/birth-year-proofs";

const MAYORS_PRIVATEKEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";

type TForm = {
  personEthereumAddress: string;
  birthYear: number;
  theMayorsSecretKey: string;
};

const getInitialFormState = (aliceDefaultAge: number): TForm => ({
  personEthereumAddress: "",
  birthYear: aliceDefaultAge,
  theMayorsSecretKey: MAYORS_PRIVATEKEY,
});

export const signBirthYear = async (form: TForm) => {
  const { personEthereumAddress, birthYear, theMayorsSecretKey } = form;
  const claimHash = ethers.utils.solidityKeccak256(["address", "uint16"], [personEthereumAddress, birthYear]);

  const privateKey = ethers.utils.arrayify(theMayorsSecretKey);
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
              onChange={e => setForm({ ...form, birthYear: Number(e.target.value) })}
            />
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Super secret key for signing</span>
            </label>
            <input
              type="text"
              placeholder="Super secret key"
              value={form.theMayorsSecretKey}
              className="input input-bordered"
              onChange={e => setForm({ ...form, theMayorsSecretKey: e.target.value })}
            />
            <label className="label">
              <p className="label-text-alt mt-0">MAYORS_PRIVATEKEY EXPLANATION</p>
            </label>
          </div>
          <div className="form-control">
            <button className="btn btn-primary" onClick={handleSubmission}>
              Generate proof
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
