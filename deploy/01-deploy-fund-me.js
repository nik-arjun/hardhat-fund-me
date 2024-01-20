// async function deployFunc(hre) {
//    console.log("Fund Me Smart contract");
// }

// module.exports.default = deployFunc;

// module.exports = async (hre) => {
//    const { getNamedAccounts, deployments } = hre;

const { network, run } = require("hardhat");
const {
   networkConfig,
   developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
   const { deploy, log } = deployments;
   const { deployer } = await getNamedAccounts();
   const chainId = network.config.chainId;

   // const ethUSDPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"];
   let ethUSDPriceFeedAddress;

   if (developmentChains.includes(network.name)) {
      const ethUSDAggregator = await deployments.get("MockV3Aggregator");
      ethUSDPriceFeedAddress = ethUSDAggregator.address;
   } else {
      ethUSDPriceFeedAddress = networkConfig[chainId]["ethUSDPriceFeed"];
   }

   // if the contract doesn't exist, we deploy a minimal version of
   // our local testing

   // what happens when we want to change the chains
   // when going for the localhost or hardhat network we wantto use a mock
   const args = [ethUSDPriceFeedAddress];
   const fundMe = await deploy("FundMe", {
      from: deployer,
      args: args, // Pricefeed Address
      log: true,
      waitConfirmations: network.config.blockConfirmations || 1,
   });

   if (
      !developmentChains.includes(network.name) &&
      process.env.ETHERSCAN_API_KEY
   ) {
      await verify(fundMe.address, args);
   }
   log("------------------------------------");
};

module.exports.tags = ["all", "fundMe"];
