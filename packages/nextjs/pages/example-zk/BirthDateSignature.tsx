import { useState } from "react";
import { ethers } from "ethers";
import secp256k1 from "secp256k1";
import { AddressInput } from "~~/components/scaffold-eth/Input/AddressInput";

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
  const [signedBirthYear, setSignedBirthYear] = useState<string>("");
  const [signerPublicKey, setSignerPublicKey] = useState<string>("");
  const handleSubmission = async () => {
    const { signedMessage, signerPublicKey } = await signBirthYear(form);
    setSignedBirthYear(signedMessage);
    setSignerPublicKey(signerPublicKey);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center bg-red-50">
        <p>This is as the role of the authority in town.</p>
        <p>Generate proof-of-birthyear-signature here.</p>
        <AddressInput
          value={form.personEthereumAddress}
          name="personEthereumAddress"
          placeholder="Ethereum address of person to sign for"
          onChange={(val: string) => setForm({ ...form, personEthereumAddress: val })}
        />
        <input
          type="number"
          placeholder="birth-year"
          value={form.birthYear}
          onChange={e => setForm({ ...form, birthYear: e.target.value as unknown as number })}
        />
        <input
          type="text"
          placeholder="super-secret-key-for-signing"
          value={form.theMayorsSecretKey}
          onChange={e => setForm({ ...form, theMayorsSecretKey: e.target.value })}
        />
        <button className="border-2 border-black" onClick={handleSubmission}>
          Generate proof-of-birthyear-signature
        </button>
        {signedBirthYear && signerPublicKey && (
          <div className="h-200 w-80 bg-green-50">
            <p>proof-of-birthyear-signature</p>
            <p className="break-words">{signedBirthYear}</p>
            <p>proof-of-birthyear-publickey</p>
            <p className="break-words">{signerPublicKey}</p>
          </div>
        )}
      </div>
    </>
  );
};
