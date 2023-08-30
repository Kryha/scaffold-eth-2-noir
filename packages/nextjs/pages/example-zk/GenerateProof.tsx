import { useState } from "react";
import { CodeText } from "./CodeText";
import SignedStats from "./SignedStats";
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
      const { proof } = await generateProof("LessThanSignedAge", parsedForm as ParsedArgs);
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
          TTODOTODOTODOTODOTODO - are these paths correct? - TODOTODOTODOTODOODO! In{" "}
          <CodeText text="packages/nextjs/utils/noir/noirBrowser.ts" /> you can see that we are importing from{" "}
          <CodeText text="aztec/bb.js" /> and <CodeText text="noir-lang/acvm_js" />, but we could also generate this
          proof with{" "}
          <CodeText
            text="nargo
          prove"
          />
          . We are also using the predefined circuit-ABI byte code from{" "}
          <CodeText text="packages/nextjs/generated/circuits.json" />, but we could re-compile it using{" "}
          <CodeText text="nargo compile" />.
        </p>
        <p>
          *Note that the &quot;signed age&quot; and &quot;ethereum address&quot;, must be the same as the ones you used
          to generate the signed message.
        </p>
      </div>
      <div className="card flex-shrink-0 w-full max-w-lg shadow-2xl bg-base-100">
        <SignedStats />
        <div className="card-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-8">
            <div className="form-control">
              <label className="label">
                <span className="label-text">*Signed birth year</span>
              </label>
              <input
                type="number"
                placeholder="Signed birth year"
                className="input input-bordered"
                value={form.birthYear}
                onChange={e => setForm({ ...form, birthYear: e.target.value as unknown as number })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Required birth year</span>
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
                <span className="label-text">Birth year signature 📜</span>
              </label>
              <input
                type="text"
                placeholder="Birth year signature"
                className="input input-bordered"
                value={form.proofOfBirthYearSignedMessage}
                onChange={e => setForm({ ...form, proofOfBirthYearSignedMessage: e.target.value })}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Public key of signer 🏛</span>
              </label>
              <input
                type="text"
                placeholder="Public key of signer"
                className="input input-bordered"
                value={form.proofOfBirthYearPublicKey}
                onChange={e => setForm({ ...form, proofOfBirthYearPublicKey: e.target.value })}
              />
            </div>
          </div>
          <div className="form-control">
            <label className="label">
              <span className="label-text">*Ethereum address signature</span>
            </label>
            <AddressInput
              value={form.personEthereumAddress}
              name="personEthereumAddress"
              placeholder="Ethereum address in signature"
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
