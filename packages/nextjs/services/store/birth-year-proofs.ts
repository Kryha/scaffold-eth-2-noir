import { create } from "zustand";
import { HexString } from "~~/hooks/noir/useProofGenerator";

type BirthYearProofs = {
  signedBirthYear: string;
  signerPublicKey: string;
  proof: HexString;
  setSignedBirthYear: (input: string) => void;
  setSignerPublicKey: (input: string) => void;
  setProof: (input: HexString) => void;
};

export const useBirthYearProofsStore = create<BirthYearProofs>(set => ({
  signedBirthYear: "",
  signerPublicKey: "",
  proof: "0x",
  setSignedBirthYear: (input: string) => set({ signedBirthYear: input }),
  setSignerPublicKey: (input: string) => set({ signerPublicKey: input }),
  setProof: (input: HexString) => set({ proof: input }),
}));
