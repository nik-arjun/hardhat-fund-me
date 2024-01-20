const { getNamedAccounts, ethers } = require("hardhat");

async function main() {
   const { deployer } = getNamedAccounts;
   const fundMe = await ethers.getContract("FundMe", deployer);
   console.log("Contract Deployed");
   console.log("Funding...");
   const transactionResponce = await fundMe.withdraw();
   await transactionResponce.wait(1);
   console.log("Withdrawing Completed");
}

main()
   .then(() => process.exit(0))
   .catch((error) => {
      console.error(error);
      process.exit(1);
   });
