import Stat from "./Stat";
import type { NextPage } from "next";
import { useBirthYearProofsStore } from "~~/services/store/birth-year-proofs";

const SignedStats: NextPage = () => {
  const signedBirthYear = useBirthYearProofsStore(state => state.signedBirthYear);
  const signerPublicKey = useBirthYearProofsStore(state => state.signerPublicKey);
  const proof = useBirthYearProofsStore(state => state.proof);

  return (
    <div className="stats stats-vertical sm:stats-horizontal shadow mb-8">
      {signedBirthYear && <Stat title="Signed birth year" stat={signedBirthYear} description="Small description" />}
      {signerPublicKey && <Stat title="Signed public key" stat={signerPublicKey} description="Small description" />}
      {proof && <Stat title="Signed proof of valid age" stat={proof} description="Small description" />}
    </div>
  );
};

export default SignedStats;
