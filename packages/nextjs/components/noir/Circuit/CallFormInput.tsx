import { Dispatch, SetStateAction } from "react";
import { InputBase } from "~~/components/scaffold-eth";
import { CircuitAbiParameters } from "~~/utils/noir/circuit";

type CallFormInputProps = {
  setForm: Dispatch<SetStateAction<Record<string, any>>>;
  form: Record<string, any>;
  stateObjectKey: string;
  param: CircuitAbiParameters[number];
};

/**
 * Generic Input component to handle input's based on their function param type
 */
export const CallFormInput = ({ setForm, form, stateObjectKey, param }: CallFormInputProps) => {
  const inputProps = {
    name: stateObjectKey,
    value: form[stateObjectKey],
    placeholder: `${param.visibility} ${param.type.kind} ${param.name}`,
    onChange: (value: any) => {
      setForm(form => ({ ...form, [stateObjectKey]: value }));
    },
  };

  // if (param.type.kind === "string") {
  //   // TODO
  // } else if (param.type.kind === "field") {
  //   // TODO
  // } else if (param.type.kind === "integer") {
  //   // TODO
  // } else if (param.type.kind === "array") {
  //   // TODO
  // } else {
  //   console.error("Unsupported param type:", param.type.kind);
  //   console.log(JSON.stringify(param.type, null, 2));
  // }

  return <InputBase {...inputProps} />;
};
