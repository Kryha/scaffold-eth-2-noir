import { Dispatch, SetStateAction, useState } from "react";
import { AgeRestrictedContractExecutor } from "./AgeRestrictedContractExecutor";
import { BirthDateSignature } from "./BirthDateSignature";
import { FlavourText } from "./FlavourText";
import { GenerateProof } from "./GenerateProof";
import type { NextPage } from "next";

const TEN_YEARS = 1000 * 60 * 60 * 24 * 365 * 10;
const YEAR_TEN_YEARS_AGO = new Date(Date.now() - TEN_YEARS).getFullYear();
const FIRST_STEP = 1;
const LAST_STEP = 4;

export function renderZkSteps(currentStep: number, setCurrentStep: Dispatch<SetStateAction<number>>) {
  switch (currentStep) {
    case 1:
      return (
        <div className="hero bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <FlavourText yearTenYearsAgo={YEAR_TEN_YEARS_AGO} />
              <button
                className="btn btn-primary mt-6"
                onClick={() => setCurrentStep((currentStep2: number) => currentStep2 + 1)}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      );
    case 2:
      return <BirthDateSignature aliceDefaultAge={YEAR_TEN_YEARS_AGO + 1} />;
    case 3:
      return <GenerateProof requiredBirthYear={YEAR_TEN_YEARS_AGO} />;
    case 4:
      return <AgeRestrictedContractExecutor />;
    default:
      return <></>;
  }
}

const ZkSteps: NextPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <>
      {renderZkSteps(currentStep, setCurrentStep)}
      <div className="join grid grid-cols-2 mt-8 gap-8">
        {currentStep !== FIRST_STEP && (
          <>
            <button
              className="join-item btn btn-outline"
              onClick={() => setCurrentStep(currentStep => currentStep - 1)}
              disabled={currentStep === FIRST_STEP}
            >
              Previous
            </button>
            <button
              className="join-item btn btn-outline"
              onClick={() => setCurrentStep(currentStep => currentStep + 1)}
              disabled={currentStep === LAST_STEP}
            >
              Next
            </button>
          </>
        )}
      </div>
    </>
  );
};

export default ZkSteps;
