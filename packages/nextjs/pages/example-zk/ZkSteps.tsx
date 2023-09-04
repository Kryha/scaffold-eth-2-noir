import { Dispatch, SetStateAction, useState } from "react";
import { AgeRestrictedContractExecutor } from "./AgeRestrictedContractExecutor";
import { BirthDateSignature } from "./BirthDateSignature";
import { GenerateProof } from "./GenerateProof";
import SignedStats from "./SignedStats";
import { ZkStepsIntro } from "./ZkStepsIntro";
import type { NextPage } from "next";

const TEN_YEARS = 1000 * 60 * 60 * 24 * 365 * 10;
const YEAR_TEN_YEARS_AGO = new Date(Date.now() - TEN_YEARS).getFullYear();
const INTRO_STEP = 0;
const LAST_STEP = 3;

export function renderZkSteps(currentStep: number, setCurrentStep: Dispatch<SetStateAction<number>>) {
  switch (currentStep) {
    case 0:
      return <ZkStepsIntro setCurrentStep={setCurrentStep} yearTenYearsAgo={YEAR_TEN_YEARS_AGO} />;
    case 1:
      return <BirthDateSignature aliceDefaultAge={YEAR_TEN_YEARS_AGO + 1} />;
    case 2:
      return <GenerateProof requiredBirthYear={YEAR_TEN_YEARS_AGO} />;
    case 3:
      return <AgeRestrictedContractExecutor />;
    default:
      return <></>;
  }
}

const ZkSteps: NextPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const step2ClassName = currentStep >= 2 ? "step-primary" : "";
  const step3ClassName = currentStep >= 3 ? "step-primary" : "";
  const previousButtonDisabled = currentStep === INTRO_STEP;

  return (
    <>
      <SignedStats />
      {renderZkSteps(currentStep, setCurrentStep)}
      {currentStep !== INTRO_STEP && (
        <>
          <ul className="steps pt-12 steps-vertical md:steps-horizontal">
            <li className="step step-primary">Third party signature 🏛📜</li>
            <li className={`step ${step2ClassName}`}>Generate proof ✅</li>
            <li className={`step ${step3ClassName}`}>Call contract🎈</li>
          </ul>
          <div className="join grid grid-cols-2 mt-8 gap-8">
            <>
              <button
                className="join-item btn btn-outline"
                onClick={() => setCurrentStep(currentStep => currentStep - 1)}
                disabled={previousButtonDisabled}
              >
                Previous
              </button>
              {currentStep !== LAST_STEP && (
                <button
                  className="join-item btn btn-outline"
                  onClick={() => setCurrentStep(currentStep => currentStep + 1)}
                >
                  Next
                </button>
              )}
            </>
          </div>
        </>
      )}
    </>
  );
};

export default ZkSteps;
