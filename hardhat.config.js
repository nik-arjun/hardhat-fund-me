const { version } = require("chai");

require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("dotenv").config();
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-solhint");
require("solidity-coverage");
require("hardhat-deploy");
require("@nomicfoundation/hardhat-verify");

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
   defaultNetwork: "hardhat",
   // solidity: "0.8.19",
   solidity: {
      compilers: [{ version: "0.8.19" }, { version: "0.6.6" }],
   },
   networks: {
      sepolia: {
         url: SEPOLIA_RPC_URL,
         accounts: [PRIVATE_KEY],
         chainId: 11155111,
         blockConfirmation: 6,
      },
   },
   etherscan: {
      apiKey: ETHERSCAN_API_KEY,
   },
   gasReporter: {
      enabled: true,
      noColors: true,
      outputFile: "gas-reporter.txt",
      currency: "USD",
      coinmarketcap: COINMARKETCAP_API_KEY,
      token: "ETH",
   },
   namedAccounts: {
      deployer: {
         default: 0,
      },
   },
};
