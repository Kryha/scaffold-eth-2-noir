import circuitData from "~~/generated/circuits.json";

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
type ABI_ParamWitnesses = any;
// What is this?
// "param_witnesses": {
//   "x": [
//     1
//   ],
//   "y": [
//     2
//   ]
// },
type ABI_ReturnWitness = any;
type ABI_ReturnType = any;
// perhaps this type is the same as type in ABI_Parameter
type ABI = {
  parameters: ABI_Parameter[];
  param_witnesses: ABI_ParamWitnesses;
  return_witnesses: ABI_ReturnWitness[];
  return_type: ABI_ReturnType;
};
export type ACIR = string; // base64 encoded

export type GenericCircuitsDeclaration = {
  [name: string]: {
    bytecode: ACIR;
    abi: ABI;
  };
};

export const circuits = circuitData || {};

export type CircuitName = keyof typeof circuits;

export type Circuits = typeof circuits;

export type Circuit<TCircuitName extends CircuitName> = Circuits[TCircuitName];

export type CircuitBytecode = Circuit<CircuitName>["bytecode"];
export type CircuitAbiParameters = Circuit<CircuitName>["abi"]["parameters"];
export type CircuitAbi = Circuit<CircuitName>["abi"];
export type CircuitParameterWitnesses = Circuit<CircuitName>["abi"]["param_witnesses"];

export enum CircuitCodeStatus {
  "FOUND",
  "NOT_FOUND",
}

//export function convertParamInputType (input:string, )
