const networkConfig = {
   11155111: {
      name: "sepolia",
      ethUSDPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
   },
   137: {
      name: "polygon",
      ethUSDPriceFeed: "0x0715A7794a1dc8e42615F059dD6e406A6594651A",
   },
   // 31337
};

const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;
const developmentChains = ["hardhat", "localhost"];

module.exports = {
   networkConfig,
   developmentChains,
   DECIMALS,
   INITIAL_ANSWER,
};
