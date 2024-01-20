const { ethers, getNamedAccounts, deployments, network } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");
const { assert } = require("chai");

developmentChains.includes(network.name)
   ? describe.skip
   : describe("FundMe", async function () {
        let fundMe, deployer, mockV3Aggregator;
        const sendValue = await ethers.parseEther("1");
        beforeEach(async function () {
           deployer = (await getNamedAccounts()).deployer;
           fundMe = await ethers.getContract("FundMe", deployer);
        });

        it("It allows people to fund and withdraw", async function () {
           await fundMe.fund({ value: sendValue });
           await fundMe.withdraw();

           const endingContractBalance = await ethers.provider.getBalance(
              await fundMe.getAddress()
           );

           assert.equal(endingContractBalance.toString(), "0");
        });
     });
