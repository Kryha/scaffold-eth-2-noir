import circuitData from "~~/generated/circuits.json";

// TODO: the types here needs some work to work in a more general context.

type KindInteger = {
  kind: "integer";
  sign: "signed" | "unsigned";
  width: number;
};
type KindField = {
  kind: "field";
};
type KindArray = {
  kind: "array";
  length: number;
  type: ABI_ParameterType;
};

type ABI_ParameterType = KindInteger | KindArray | KindField;

type ABI_Parameter = {
  name: string;
  type: ABI_ParameterType;
  visibility: "public" | "private";
};
type ABI_ParamWitness = number[];

// perhaps return type is the same as type in ABI_Parameter
type ABI_ReturnWitness = any;
type ABI_ReturnType = any;

type ABI = {
  parameters: ABI_Parameter[];
  param_witnesses: Record<ABI_Parameter["name"], ABI_ParamWitness>;
  return_witnesses: ABI_ReturnWitness[];
  return_type: ABI_ReturnType;
};
export type ACIR = string; // base64 encoded

export type GenericCircuitsDeclaration = {
  [name: string]: {
    backend: string;
    bytecode: ACIR;
    abi: ABI;
  };
};

export const circuits = circuitData || {};

export type CircuitName = keyof typeof circuits;

export type Circuits = GenericCircuitsDeclaration;

export type Circuit<TCircuitName extends CircuitName> = Circuits[TCircuitName];

export type CircuitBytecode = Circuit<CircuitName>["bytecode"];
export type CircuitAbi = Circuit<CircuitName>["abi"];
export type CircuitAbiParameters = Circuit<CircuitName>["abi"]["parameters"] | ABI_Parameter[];
export type CircuitParameterWitnesses = Circuit<CircuitName>["abi"]["param_witnesses"] | ABI_ParamWitness[];

export enum CircuitCodeStatus {
  "FOUND",
  "NOT_FOUND",
}

//export function convertParamInputType (input:string, )
