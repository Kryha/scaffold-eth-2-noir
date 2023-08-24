import { useState } from "react";
import { CallFormInput } from "./CallFormInput";
import { ProofResult } from "./Proof";
import { getFunctionInputKey, getInitialFormState } from "./utilsCircuit";
import useProofGenerator from "~~/hooks/noir/useProofGenerator";
import { useProvingNotifications } from "~~/hooks/noir/useProvingNotifications";
import { Proof } from "~~/interfaces";
import { CircuitAbiParameters, CircuitName } from "~~/utils/noir/circuit";
import { notification } from "~~/utils/scaffold-eth";

type TCallFormProps = {
  circuitName: CircuitName;
  params: CircuitAbiParameters;
};

export const CallForm = ({ circuitName, params }: TCallFormProps) => {
  const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(circuitName, params));
  const withNotifications = useProvingNotifications();
  const { isLoading, generateProof } = useProofGenerator(circuitName, form);
  const [displayedGenerationResult, setDisplayedGenerationResult] = useState<Proof>();

  const handleWrite = async () => {
    try {
      const proofProm = generateProof();
      withNotifications(proofProm);
      const { proof } = await proofProm;
      // TODO: below does not refresh the UI
      setDisplayedGenerationResult(proof);
    } catch (e: any) {
      notification.error(e.message);
    }
  };

  const inputs = params.map((p, index) => {
    const key = getFunctionInputKey(circuitName, p, index);
    return (
      <CallFormInput
        key={key}
        setForm={updatedFormValue => {
          setDisplayedGenerationResult(undefined);
          setForm(updatedFormValue);
        }}
        form={form}
        stateObjectKey={key}
        param={p}
      />
    );
  });

  return (
    <div className="py-5 space-y-3 first:pt-0 last:pb-1">
      <div className={"flex gap-3 flex-col"}>
        {inputs}
        <div className="flex justify-between gap-2">
          <div className="flex-grow basis-0">
            {displayedGenerationResult ? <ProofResult proof={displayedGenerationResult} /> : null}
          </div>
        </div>
        <div className={"flex"}>
          <button className={`btn btn-secondary btn-sm ${isLoading ? "loading" : ""}`} onClick={handleWrite}>
            Generate proof 🧠
          </button>
        </div>
      </div>
    </div>
  );
};
