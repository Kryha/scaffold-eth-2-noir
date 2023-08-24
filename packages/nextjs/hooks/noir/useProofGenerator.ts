import { CircuitAbiParameters, CircuitName, CircuitParameterWitnesses, circuits } from "~~/utils/noir/circuit";
import { NoirBrowser } from "~~/utils/noir/noirBrowser";

let isGeneratingProof = false;

type HexString = `0x${string}`;
export type ParsedArgs = Record<string, HexString[]>;

function formatArgs(parameterWitnesses: CircuitParameterWitnesses, parsedArgs: ParsedArgs): HexString[] {
  // NOTE: workaround for not being able to use named parameters
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
      return acc + (param.type.length || 1);
    }, 0);
}

export const generateProof = async (circuitName: CircuitName, parsedArgs: ParsedArgs) => {
  isGeneratingProof = true;
  console.log("🧠 start");
  console.log("parsedArgs", parsedArgs);
  const noir = new NoirBrowser();
  try {
    const circuit = circuits[circuitName];
    await noir.init(circuit.bytecode);
    const formattedArgs = formatArgs(circuit.abi.param_witnesses, parsedArgs);
    const witness: Uint8Array = await noir.generateWitness(formattedArgs);
    const proof: Uint8Array = await noir.generateProof(witness);

    const publicInputsLength = getPublicInputsLength(circuit.abi.parameters);

    const publicInputs = proof.slice(0, 32 * publicInputsLength);

    const slicedProof = proof.slice(32 * publicInputsLength);

    console.log("0x" + Buffer.from(publicInputs).toString("hex"));
    console.log("0x" + Buffer.from(slicedProof).toString("hex"));
    console.log(publicInputsLength);
    console.log(Buffer.from(slicedProof).toString("hex").length);

    return {
      witness: Buffer.from(witness).toString("hex"),
      proof: "0x" + Buffer.from(slicedProof).toString("hex"),
    };
  } finally {
    isGeneratingProof = false;
    noir.destroy();
    console.log("🧠 end");
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
