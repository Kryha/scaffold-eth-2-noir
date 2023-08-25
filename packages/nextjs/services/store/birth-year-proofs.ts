import { create } from "zustand";

export const useBirthYearProofsStore = create(set => ({
  signedBirthYear: "",
  signerPublicKey: "",
  proof: "",
  setSignedBirthYear: (input: string) => set({ signedBirthYear: input }),
  setSignerPublicKey: (input: string) => set({ signerPublicKey: input }),
  setProof: (input: string) => set({ proof: input }),
}));
