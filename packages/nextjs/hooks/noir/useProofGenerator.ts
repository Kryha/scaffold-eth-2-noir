import { BarretenbergBackend } from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import { Circuit, CircuitName, circuits } from "~~/utils/noir/circuit";

let isGeneratingProof = false;

export type HexString = `0x${string}`;
export type ParsedArgs = Record<string, HexString[] | number>;

// This function generates the proof ✅
export const generateProof = async (circuitName: CircuitName, parsedArgs: ParsedArgs) => {
  isGeneratingProof = true;
  try {
    const circuit = circuits[circuitName] as Circuit<CircuitName>;
    const backend = new BarretenbergBackend(circuit);
    const noir = new Noir(circuit, backend);
    const { proof } = await noir.generateFinalProof(parsedArgs);

    return {
      proof: Buffer.from(proof).toString("hex"),
    };
  } finally {
    isGeneratingProof = false;
  }
};

const generateProofWrapper = (circuitName: CircuitName) => {
  return async (form: Record<string, any>) => {
    const res = await generateProof(circuitName, form);
    return res;
  };
};

export default function useProofGenerator(circuitName: CircuitName) {
  return {
    isLoading: isGeneratingProof,
    generateProof: generateProofWrapper(circuitName),
  };
}
