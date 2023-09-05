import Stat from "./Stat";
import type { NextPage } from "next";
import { useBirthYearProofsStore } from "~~/services/store/birth-year-proofs";

const SignedStats: NextPage = () => {
  const signedBirthYear = useBirthYearProofsStore(state => state.signedBirthYear);
  const signerPublicKey = useBirthYearProofsStore(state => state.signerPublicKey);
  const proof = useBirthYearProofsStore(state => state.proof);

  return (
    <div className="stats stats-vertical sm:stats-horizontal shadow mb-8">
      {signerPublicKey && <Stat title="Signers public key 🏛" stat={signerPublicKey} />}
      {signedBirthYear && <Stat title="Signed birth year 📜" stat={signedBirthYear} />}
      {proof && proof.length > 2 && <Stat title="Proof of valid age ✅" stat={proof} />}
    </div>
  );
};

export default SignedStats;
