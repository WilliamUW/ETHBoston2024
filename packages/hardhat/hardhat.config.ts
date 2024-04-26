import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomicfoundation/hardhat-verify";
import "hardhat-deploy";
import "hardhat-deploy-ethers";

import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

dotenv.config();

const providerApiKey = process.env.ALCHEMY_API_KEY || "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";
const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY ?? "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const etherscanApiKey = process.env.ETHERSCAN_API_KEY || "DNXJA8RX2Q3VZ4URQIWP7Z68CJXQZSC6AW";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "morphTestnet",
  namedAccounts: {
    deployer: { default: 0 },
  },
  networks: {
    hardhat: {
      forking: {
        url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
        enabled: process.env.MAINNET_FORKING_ENABLED === "true",
      },
    },
    mainnet: { url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`, accounts: [deployerPrivateKey] },
    morphTestnet: { url: `https://rpc-testnet.morphl2.io`, accounts: [deployerPrivateKey] },
    sepolia: { url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`, accounts: [deployerPrivateKey] },
    // Other networks...
  },
  etherscan: {
    apiKey: {
      mainnet: etherscanApiKey,
      morphTestnet: 'anything',  // The apiKey for Morph Testnet for verification
    },
    customChains: [
      {
        network: "morphTestnet",
        chainId: 2710,
        urls: {
          apiURL: 'https://explorer-api-testnet.morphl2.io/api',
          browserURL: 'https://explorer-testnet.morphl2.io/',
        },
      },
    ],
  },
  verify: {
    etherscan: {
      apiKey: `${etherscanApiKey}`,
    },
  },
};

export default config;
