import type { NextPage } from "next";
import { useBirthYearProofsStore } from "~~/services/store/birth-year-proofs";

function shortenHashString(hash: string) {
  const prefix = hash.substring(0, 4);
  const suffix = hash.substring(hash.length - 4);

  return prefix + "..." + suffix;
}

export function copyToClipboard({
  text,
  successCallback,
  errorCallback,
}: {
  text: string;
  successCallback?: () => void;
  errorCallback?: () => void;
}) {
  if (navigator) {
    navigator.clipboard.writeText(text).then(
      function () {
        if (successCallback) {
          successCallback();
        }
      },
      function () {
        if (errorCallback) {
          errorCallback();
        }
      },
    );
  } else {
    if (errorCallback) {
      errorCallback();
    }
  }
}

const SignedStats: NextPage = () => {
  const signedBirthYear = useBirthYearProofsStore(state => state.signedBirthYear);
  const signerPublicKey = useBirthYearProofsStore(state => state.signerPublicKey);
  const proof = useBirthYearProofsStore(state => state.proof);

  return (
    <>
      <div className="stats stats-vertical sm:stats-horizontal shadow mb-8">
        {signedBirthYear && (
          <div className="stat">
            <div className="stat-figure text-secondary">
              <button className="btn btn-circle btn-outline" onClick={() => copyToClipboard({ text: signedBirthYear })}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                  />
                </svg>
              </button>
            </div>
            <div className="stat-title">Signed birth year</div>
            <div className="stat-value">{shortenHashString(signedBirthYear)}</div>
            <div className="stat-desc">Small description</div>
          </div>
        )}
        {signerPublicKey && (
          <div className="stat">
            <div className="stat-figure text-secondary">
              <button className="btn btn-circle btn-outline" onClick={() => copyToClipboard({ text: signerPublicKey })}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                  />
                </svg>
              </button>
            </div>
            <div className="stat-title">Signed public key</div>
            <div className="stat-value">{shortenHashString(signerPublicKey)}</div>
            <div className="stat-desc">Small description</div>
          </div>
        )}
        {proof && (
          <div className="stat">
            <div className="stat-figure text-secondary">
              <button className="btn btn-circle btn-outline" onClick={() => copyToClipboard({ text: proof })}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 cursor-pointer"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
                  />
                </svg>
              </button>
            </div>
            <div className="stat-title">Signed proof of valid age</div>
            <div className="stat-value">{shortenHashString(proof)}</div>
            <div className="stat-desc">Small description</div>
          </div>
        )}
      </div>
    </>
  );
};

export default SignedStats;
