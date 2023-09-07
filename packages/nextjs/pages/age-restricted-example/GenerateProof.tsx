import { useState } from "react";
import { CodeText } from "./CodeText";
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
  const ethereumAddress = useBirthYearProofsStore(state => state.ethereumAddress);
  const setEthereumAddress = useBirthYearProofsStore(state => state.setEthereumAddress);
  const birthYear = useBirthYearProofsStore(state => state.birthYear);
  const setBirthYear = useBirthYearProofsStore(state => state.setBirthYear);
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
      const parsedForm = parseForm({ ...form, personEthereumAddress: ethereumAddress, birthYear });
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
    <div className="grid grid-cols-2 gap-6 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold">Step 2: Generating the proof ✅</h1>
        <p>
          In order for <strong>Alice</strong> to really know that she&apos;s not sharing any private information with
          the <strong>Ballon Store</strong> two things should be possible:
          <ol>
            <li>
              1. The code that generates the the proof should be <strong>open source</strong> for Alice to review
            </li>
            <li>
              2. The proof generation should happen in an environment trusted by<strong>Alice</strong> (ex: locally in
              her laptop or phone)
            </li>
          </ol>
        </p>
        <p>
          A circuit written in <strong>Noir</strong> is used for generating the proof and for generating a
          proof-verifier. The <strong>Ballon Store</strong> will use the proof as input to execute the verifier contract
          on-chain:{" "}
          <a href="https://github.com/Kryha/scaffold-eth-2-noir/blob/main/packages/noir/circuits/LessThanSignedAge/src/main.nr">
            <CodeText text="packages/noir/circuits/LessThanSignedAge/src/main.nr" />
          </a>
        </p>
        <p>
          The proof is generated in the browser using the following libraries:
          <ul>
            <li>
              - <CodeText text="aztec/bb.js" />
            </li>
            <li>
              - <CodeText text="noir-lang/acvm_js" />
            </li>
          </ul>
          Check out the implementation here:{" "}
          <a href="https://github.com/Kryha/scaffold-eth-2-noir/blob/main/packages/nextjs/utils/noir/noirBrowser.ts">
            <CodeText text="packages/nextjs/utils/noir/noirBrowser.ts" />
          </a>
        </p>
        <p>
          The proof can also be generated locally (outside of a browser) using <CodeText text="nargo" />, the CLI-tool
          for Noir. Just execute <CodeText text="nargo prove" /> in the terminal.
        </p>
        <p>
          The predefined circuit ABI code used to generate the proof can be found in{" "}
          <a href="https://github.com/Kryha/scaffold-eth-2-noir/blob/main/packages/nextjs/generated/circuits.json">
            <CodeText text="packages/nextjs/generated/circuits.json" />
          </a>
          , but we could recompile it using <CodeText text="nargo compile" />.
        </p>
      </div>
      <div>
        <div className="card w-full shadow-2xl bg-base-100">
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
                  value={birthYear}
                  onChange={e => setBirthYear(e.target.value)}
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
                  onChange={e => setForm({ ...form, requiredBirthYear: Number(e.target.value) })}
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
                value={ethereumAddress}
                name="personEthereumAddress"
                placeholder="Ethereum address in signature"
                onChange={(value: string) => setEthereumAddress(value)}
              />
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-secondary" onClick={handleSubmission} disabled={isProofRunning}>
                Generate proof ✅
              </button>
            </div>
          </div>
        </div>
        <p>
          * Note that the &quot;signed age&quot; and &quot;ethereum address&quot;, must be the same as the ones you used
          to generate the signed message.
        </p>
      </div>
    </div>
  );
};
