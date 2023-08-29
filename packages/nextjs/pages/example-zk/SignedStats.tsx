import Stat from "./Stat";
import type { NextPage } from "next";
import { useBirthYearProofsStore } from "~~/services/store/birth-year-proofs";

const SignedStats: NextPage = () => {
  const signedBirthYear = useBirthYearProofsStore(state => state.signedBirthYear);
  const signerPublicKey = useBirthYearProofsStore(state => state.signerPublicKey);
  const proof = useBirthYearProofsStore(state => state.proof);

  return (
    <div className="stats stats-vertical sm:stats-horizontal shadow mb-8">
      {proof && proof.length > 2 && <Stat title="Proof of valid age ✅" stat={proof} description="TODO" />}
      {signedBirthYear && <Stat title="Signed birth year 📜" stat={signedBirthYear} description="TODO" />}
      {signerPublicKey && <Stat title="Signers public key 🏛" stat={signerPublicKey} description="TODO" />}
    </div>
  );
};

export default SignedStats;
