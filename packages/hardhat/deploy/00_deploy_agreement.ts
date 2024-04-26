import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deploySignedNFTAgreement: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Example parameters for deployment, adjust these as per actual use case requirements
  const initialOwner = deployer;
  const loanAmount = hre.ethers.parseEther("1"); // Example: 1 ETH
  const interestRate = 500; // Example: 5.00% (500 basis points)
  const loanDuration = 30 * 24 * 60 * 60; // Example: 30 days in seconds
  const rwaCollateralAgreementHash = "0xb3b206c9e6761e8bca64b4682089d0f1a8f3a12bfa731a6c06f2dfa5783a4cde"; // Example hash

  // Deploy SignedNFTAgreement contract with constructor arguments
  const signedNFTAgreementDeployment = await deploy("SignedNFTAgreement", {
    from: deployer,
    args: [initialOwner, loanAmount, interestRate, loanDuration, rwaCollateralAgreementHash],
    log: true,
    autoMine: true,
  });

  // Log the deployment address
  console.log("SignedNFTAgreement deployed to:", signedNFTAgreementDeployment.address);
};

export default deploySignedNFTAgreement;
deploySignedNFTAgreement.tags = ["SignedNFTAgreement"];
