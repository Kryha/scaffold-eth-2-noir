import { useState } from "react";
import { ethers } from "ethers";
import { AddressInput } from "~~/components/scaffold-eth/Input/AddressInput";
import { ParsedArgs, generateProof } from "~~/hooks/noir/useProofGenerator";
import { useBirthYearProofsStore } from "~~/services/store/birth-year-proofs";
import { notification } from "~~/utils/scaffold-eth";

type TForm = {
  birthYear: number;
  requiredBirthYear: number;
  proofOfBirthYearSignedMessage: string;
  proofOfBirthYearPublicKey: string;
  personEthereumAddress: string;
};

const getInitialFormState = ({
  requiredBirthYear,
  signedBirthYear,
  signerPublicKey,
}: {
  requiredBirthYear: number;
  signedBirthYear: string;
  signerPublicKey: string;
}): TForm => ({
  birthYear: requiredBirthYear + 1,
  requiredBirthYear,
  proofOfBirthYearSignedMessage: signedBirthYear || "",
  proofOfBirthYearPublicKey: signerPublicKey || "",
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
  const setProof = useBirthYearProofsStore(state => state.setProof);
  const signedBirthYear = useBirthYearProofsStore(state => state.signedBirthYear);
  const signerPublicKey = useBirthYearProofsStore(state => state.signerPublicKey);
  const [form, setForm] = useState<TForm>(() =>
    getInitialFormState({ requiredBirthYear, signedBirthYear, signerPublicKey }),
  );
  const [isProofRunning, setIsProofRunning] = useState(false);

  const handleSubmission = async () => {
    setIsProofRunning(true);
    const notifcationId = notification.loading("Generating proof...");
    try {
      const parsedForm = parseForm(form);
      const { proof } = await generateProof("LessThenSignedAge", parsedForm as ParsedArgs);
      setProof(`0x${proof}`);
      notification.success("Proof generated");
    } catch (e: any) {
      console.error(e.stack);
      notification.error("Proof generation failed");
    } finally {
      notification.remove(notifcationId);
      setIsProofRunning(false);
    }
  };

  return (
    <>
      <div className="flex-shrink-0 w-full max-w-5xl px-6 pb-6">
        <p>
          One of the reasons that Alice knows that she is not sharing her birth year with anyone is that the proof
          generation is open source, and she herself can double check the code. Furthermore she can even generate the
          proof✅ herself locally. This is actually what we are doing in this implementation.
        </p>
        <p>
          TTODOTODOTODOTODOTODOTODOTODOTODOTODOODO! In `packages/nextjs/utils/noir/noirBrowser.ts` you can see that we
          are importing from `@aztec/bb.js` and `@noir-lang/acvm_js`, but we could also generate this proof with `nargo
          prove`. We are also using the predefined circuit-ABI byte code from `packages/nextjs/generated/circuits.json`,
          but we could re-compile it using `nargo compile`.
        </p>
      </div>
      <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-8">
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
                <span className="label-text">Enter your required birth year</span>
              </label>
              <input
                type="number"
                placeholder="Required birth year"
                className="input input-bordered"
                value={form.requiredBirthYear}
                onChange={e => setForm({ ...form, requiredBirthYear: e.target.value as unknown as number })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Super secret key for signing</span>
              </label>
              <input
                type="text"
                placeholder="Proof of birth year signed"
                className="input input-bordered"
                value={form.proofOfBirthYearSignedMessage}
                onChange={e => setForm({ ...form, proofOfBirthYearSignedMessage: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Proof public key</span>
              </label>
              <input
                type="text"
                placeholder="proof-of-birth-year-public-key"
                className="input input-bordered"
                value={form.proofOfBirthYearPublicKey}
                onChange={e => setForm({ ...form, proofOfBirthYearPublicKey: e.target.value })}
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Ethereum address of person in signed message</span>
            </label>
            <AddressInput
              value={form.personEthereumAddress}
              name="personEthereumAddress"
              placeholder="Ethereum address of person in signed message"
              onChange={(val: string) => setForm({ ...form, personEthereumAddress: val })}
            />
          </div>
          <div className="form-control mt-6">
            <button className="btn btn-primary" onClick={handleSubmission} disabled={isProofRunning}>
              Generate proof ✅
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
