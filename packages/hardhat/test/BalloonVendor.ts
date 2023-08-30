import { expect } from "chai";
import { ethers } from "hardhat";
import { BalloonToken, BalloonVendor } from "../typechain-types";
import { invalidProof, validProof } from "./constants";

describe("BalloonVendor", function () {
  let balloonVendor: BalloonVendor;
  let balloonToken: BalloonToken;
  let addr1: any;
  beforeEach(async () => {
    const signers = await ethers.getSigners();
    addr1 = signers[1];
    const balloonVendorFactory = await ethers.getContractFactory("BalloonVendor");
    const balloonTokenFactory = await ethers.getContractFactory("BalloonToken");
    const lessThanSignedAgeFactory = await ethers.getContractFactory(
      "contracts/verifiers/LessThanSignedAge.sol:UltraVerifier",
    );
    balloonToken = (await balloonTokenFactory.deploy()) as BalloonToken;
    const verifer = await lessThanSignedAgeFactory.deploy();
    balloonVendor = (await balloonVendorFactory.deploy(balloonToken.address, verifer.address)) as BalloonVendor;
    await balloonVendor.deployed();
    await balloonToken.transfer(balloonVendor.address, ethers.utils.parseEther("1000"));
  });

  describe("Buying tokens", function () {
    it("should be able to buy", async function () {
      await balloonVendor.connect(addr1).buyTokens({ value: 1 });
      expect(await balloonToken.balanceOf(addr1.address)).to.equal(100);
    });
  });
  describe("Redeeming tokens", function () {
    it("should be able to redeem for free as a kid", async function () {
      await balloonVendor.connect(addr1).redeemFreeToken(validProof);
      expect(await balloonToken.balanceOf(addr1.address)).to.equal(1);
    });

    it("should not work with invalid proof", async function () {
      try {
        await balloonVendor.connect(addr1).redeemFreeToken(invalidProof);
      } catch (e: any) {
        expect(e.message).to.contain("PROOF_FAILURE");
      }
    });
  });
});
