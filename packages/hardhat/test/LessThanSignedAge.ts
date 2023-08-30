import { expect } from "chai";
import { ethers } from "hardhat";
import { UltraVerifier } from "../typechain-types";
import { validProof, validPublicInputs } from "./constants";

function transformPublicInputs(publicInputs: typeof validPublicInputs): string[] {
  let publicInputsArray: string[] = [];
  for (const pubInput of publicInputs) {
    if (typeof pubInput === "object") {
      publicInputsArray = publicInputsArray.concat(pubInput);
    } else {
      publicInputsArray.push(pubInput);
    }
  }
  return publicInputsArray;
}

describe("LessThanSignedAge", function () {
  let verifier: UltraVerifier;
  before(async () => {
    const verifierFactory = await ethers.getContractFactory("contracts/verifiers/LessThanSignedAge.sol:UltraVerifier");
    verifier = (await verifierFactory.deploy()) as UltraVerifier;
    await verifier.deployed();
  });

  describe("verify", function () {
    it("should verify valid proof", async function () {
      expect(await verifier.verify(validProof, transformPublicInputs(validPublicInputs))).to.equal(true);
    });
  });
});
