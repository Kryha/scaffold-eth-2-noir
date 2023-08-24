import { useState } from "react";
import { ethers } from "ethers";
import { AddressInput } from "~~/components/scaffold-eth/Input/AddressInput";
import { ParsedArgs, generateProof } from "~~/hooks/noir/useProofGenerator";

type TForm = {
  birthYear: number;
  requiredBirthYear: number;
  proofOfBirthYearSignedMessage: string;
  proofOfBirthYearPublicKey: string;
  personEthereumAddress: string;
};

const getInitialFormState = (requiredBirthYear: number): TForm => ({
  birthYear: requiredBirthYear + 1,
  requiredBirthYear,
  proofOfBirthYearSignedMessage: "",
  proofOfBirthYearPublicKey: "",
  personEthereumAddress: "",
});

const buildNoirIntArray = (hexString: string) => {
  const trimmedHexString = hexString.replace("0x", "");
  return trimmedHexString
    .split("")
    .reduce((resultArray: string[], letter: string, index: number) => {
      if (index % 2 === 0) {
        resultArray.push("0x" + letter);
      } else {
        resultArray[resultArray.length - 1] += letter;
      }
      return resultArray;
    }, [])
    .map(hex => ethers.utils.hexZeroPad(hex, 32));
};

export const parseForm = (form: TForm) => {
  const pub_key_array = buildNoirIntArray(form.proofOfBirthYearPublicKey);
  const issuer_public_key_x = pub_key_array.slice(1, Math.round(pub_key_array.length / 2));
  const issuer_public_key_y = pub_key_array.slice(Math.round(pub_key_array.length / 2));
  return {
    required_birth_year: [ethers.utils.hexZeroPad(ethers.utils.hexlify(form.requiredBirthYear), 32)],
    subject_birth_year: [ethers.utils.hexZeroPad(ethers.utils.hexlify(form.birthYear), 32)],
    issuer_public_key_x,
    issuer_public_key_y,
    subject_eth_address: buildNoirIntArray(form.personEthereumAddress),
    issuer_signed_message: buildNoirIntArray(form.proofOfBirthYearSignedMessage),
  };
};

export const GenerateProof = ({ requiredBirthYear }: { requiredBirthYear: number }) => {
  const [form, setForm] = useState<TForm>(() => getInitialFormState(requiredBirthYear));
  const [proof, setProof] = useState<string>(() => "");
  const handleSubmission = async () => {
    const parsedForm = parseForm(form);
    try {
      const { proof } = await generateProof("LessThenSignedAge", parsedForm as ParsedArgs);
      setProof(proof);
    } catch (e) {
      console.error(e.stack);
    }
  };
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <p>Generate proof-of-required-birthyear here. Copy/paste from prev window.</p>
        <input
          type="number"
          placeholder="birth-year"
          value={form.birthYear}
          onChange={e => setForm({ ...form, birthYear: e.target.value as unknown as number })}
        />
        <input
          type="number"
          placeholder="required-birth-year"
          value={form.requiredBirthYear}
          onChange={e => setForm({ ...form, requiredBirthYear: e.target.value as unknown as number })}
        />
        <input
          type="text"
          placeholder="proof-of-birth-year-signed-message"
          value={form.proofOfBirthYearSignedMessage}
          onChange={e => setForm({ ...form, proofOfBirthYearSignedMessage: e.target.value })}
        />
        <input
          type="text"
          placeholder="proof-of-birth-year-public-key"
          value={form.proofOfBirthYearPublicKey}
          onChange={e => setForm({ ...form, proofOfBirthYearPublicKey: e.target.value })}
        />
        <AddressInput
          value={form.personEthereumAddress}
          name="personEthereumAddress"
          placeholder="Ethereum address of person in signed message"
          onChange={(val: string) => setForm({ ...form, personEthereumAddress: val })}
        />
        <button className="border-2 border-black" onClick={handleSubmission}>
          Generate proof-of-required-birthyear
        </button>
        {proof && (
          <div className="h-200 w-96 bg-green-50">
            <p>Proof-of-required-birthyear:</p>
            <p className="break-words">{proof}</p>
          </div>
        )}
      </div>
    </>
  );
};
