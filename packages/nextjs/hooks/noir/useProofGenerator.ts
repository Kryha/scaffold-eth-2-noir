import { Circuit, CircuitAbiParameters, CircuitName, CircuitParameterWitnesses, circuits } from "~~/utils/noir/circuit";
import { NoirBrowser } from "~~/utils/noir/noirBrowser";

let isGeneratingProof = false;

export type HexString = `0x${string}`;
export type ParsedArgs = Record<string, HexString[]>;

function formatArgs(parameterWitnesses: CircuitParameterWitnesses, parsedArgs: ParsedArgs): HexString[] {
  // NOTE: workaround for not being able to use named parameters in proof generation
  const sortedKeys = Object.entries(parameterWitnesses)
    .map(([key, paramPostitions]) => {
      return {
        key,
        paramPostitions,
      };
    })
    .sort((a, b) => {
      return a.paramPostitions[0] - b.paramPostitions[0];
    })
    .map(({ key }) => key);

  return sortedKeys.reduce((acc, key) => {
    return acc.concat(parsedArgs[key]);
  }, [] as HexString[]);
}

function getPublicInputsLength(parameters: CircuitAbiParameters) {
  return parameters
    .filter(param => param.visibility === "public")
    .reduce((acc, param) => {
      if (param.type.kind === "array") {
        return acc + param.type.length;
      } else {
        return acc + 1;
      }
    }, 0);
}

export const generateProof = async (circuitName: CircuitName, parsedArgs: ParsedArgs) => {
  isGeneratingProof = true;
  const noir = new NoirBrowser();
  try {
    const circuit = circuits[circuitName] as Circuit<CircuitName>;
    await noir.init(circuit.bytecode);
    const formattedArgs = formatArgs(circuit.abi.param_witnesses, parsedArgs);
    const witness: Uint8Array = await noir.generateWitness(formattedArgs);
    const proof: Uint8Array = await noir.generateProof(witness);

    const publicInputsLength = getPublicInputsLength(circuit.abi.parameters);
    const slicedProof = proof.slice(32 * publicInputsLength);

    return {
      witness: Buffer.from(witness).toString("hex"),
      proof: "0x" + Buffer.from(slicedProof).toString("hex"),
    };
  } finally {
    isGeneratingProof = false;
    noir.destroy();
  }
};

const generateProofWrapper = (circuitName: CircuitName, form: Record<string, any>) => {
  return async () => {
    const res = await generateProof(circuitName, parseForm(form));
    return res;
  };
};

const parseForm = (form: Record<string, any>) => {
  const parameterObj: ParsedArgs = {};
  for (const [key, value] of Object.entries(form)) {
    const [, k] = key.split("_");
    parameterObj[k] = JSON.parse(value);
  }
  return parameterObj;
};

export default function useProofGenerator(circuitName: CircuitName, form: Record<string, any>) {
  return {
    isLoading: isGeneratingProof,
    generateProof: generateProofWrapper(circuitName, form),
  };
}
