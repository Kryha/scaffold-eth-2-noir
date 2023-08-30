import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployVerifiers: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const verifierContract = await hre.ethers.getContract("VerifierLessThanSignedAge", deployer);
  const balloonTokenContract = await hre.ethers.getContract("BalloonToken", deployer);

  const balloonVendor = await deploy("BalloonVendor", {
    from: deployer,
    args: [balloonTokenContract.address, verifierContract.address],
    log: true,
    autoMine: true,
  });
  await balloonTokenContract.transfer(balloonVendor.address, ethers.utils.parseEther("1000"));
};

export default deployVerifiers;
deployVerifiers.tags = ["BalloonVendor"];
