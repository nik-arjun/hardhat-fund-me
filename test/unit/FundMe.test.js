const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
   ? describe.skip
   : describe("FundMe", function () {
        let fundMe, deployer, mockV3Aggregator;
        const sendValue = ethers.parseEther("1");
        beforeEach(async function () {
           deployer = (await getNamedAccounts()).deployer;
           await deployments.fixture(["all"]);
           fundMe = await ethers.getContract("FundMe", deployer);
           mockV3Aggregator = await ethers.getContract(
              "MockV3Aggregator",
              deployer
           );
        });

        describe("constructor", async function () {
           it("It sets the Aggregator address correctly", async function () {
              const response = await fundMe.getPricefeed();

              assert.equal(response, await mockV3Aggregator.getAddress());
           });
        });

        // describe("recieve", async function () {});

        describe("fund", async function () {
           it("Fails if you don't send enough ETH!", async function () {
              await expect(fundMe.fund()).to.be.revertedWith(
                 "Don't have enough Balance"
              );
           });

           it("Updates the funder's address in funders array", async function () {
              await fundMe.fund({ value: sendValue });
              assert.equal(deployer, await fundMe.getFunder(0));
           });

           it("Updates the funded amount in the mapping data structure", async function () {
              await fundMe.fund({ value: sendValue });
              const response = await fundMe.getAddressToAmountFunded(deployer);
              assert.equal(response.toString(), sendValue.toString());
           });
        });

        describe("withdraw", async function () {
           beforeEach(async function () {
              await fundMe.fund({ value: sendValue });
           });

           it("Withdraw funds from single funder", async function () {
              // Arrange
              const startingContractBalance = await ethers.provider.getBalance(
                 await fundMe.getAddress()
              );

              const startingDeployerBalance = await ethers.provider.getBalance(
                 deployer
              );
              // Act
              const transactionResponce = await fundMe.withdraw();
              const transactionReciept = await transactionResponce.wait(1);
              const { gasPrice, gasUsed } = transactionReciept;
              const gasCost = gasPrice * gasUsed;

              const endingContractBalance = await ethers.provider.getBalance(
                 await fundMe.getAddress()
              );

              const endingDeployerBalance = await ethers.provider.getBalance(
                 deployer
              );
              // Assert
              assert.equal(endingContractBalance, 0);
              assert.equal(
                 (endingDeployerBalance + gasCost).toString(),
                 (startingDeployerBalance + startingContractBalance).toString()
              );
           });

           it("Cheaper Withdraw funds from single funder", async function () {
              // Arrange
              const startingContractBalance = await ethers.provider.getBalance(
                 await fundMe.getAddress()
              );

              const startingDeployerBalance = await ethers.provider.getBalance(
                 deployer
              );
              // Act
              const transactionResponce = await fundMe.cheaperWithdraw();
              const transactionReciept = await transactionResponce.wait(1);
              const { gasPrice, gasUsed } = transactionReciept;
              const gasCost = gasPrice * gasUsed;

              const endingContractBalance = await ethers.provider.getBalance(
                 await fundMe.getAddress()
              );

              const endingDeployerBalance = await ethers.provider.getBalance(
                 deployer
              );
              // Assert
              assert.equal(endingContractBalance, 0);
              assert.equal(
                 (endingDeployerBalance + gasCost).toString(),
                 (startingDeployerBalance + startingContractBalance).toString()
              );
           });

           it("Withdraw funds from multiple funders", async function () {
              // Arrange
              const accounts = await ethers.getSigners();

              for (let i = 0; i < 6; i++) {
                 const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                 );
                 await fundMeConnectedContract.fund({ value: sendValue });
              }

              const startingContractBalance = await ethers.provider.getBalance(
                 await fundMe.getAddress()
              );

              const startingDeployerBalance = await ethers.provider.getBalance(
                 deployer
              );

              // Act
              const transactionResponce = await fundMe.withdraw();
              const transactionReciept = await transactionResponce.wait(1);
              const { gasUsed, gasPrice } = transactionReciept;
              const gasCost = gasUsed * gasPrice;

              const endingContractBalance = await ethers.provider.getBalance(
                 await fundMe.getAddress()
              );
              const endingDeployerBalance = await ethers.provider.getBalance(
                 deployer
              );

              // Assert
              assert.equal(endingContractBalance, 0);
              assert.equal(
                 (endingDeployerBalance + gasCost).toString(),
                 (startingDeployerBalance + startingContractBalance).toString()
              );

              await expect(fundMe.getFunder(0)).to.be.reverted;

              for (let i = 0; i < 6; i++) {
                 assert.equal(
                    await fundMe.getAddressToAmountFunded(accounts[i].address),
                    0
                 );
              }
           });

           it("Only Owner can withdraw funds from Contract", async function () {
              const accounts = await ethers.getSigners();
              const attacker = accounts[1];
              const attackerConnectedContract = await fundMe.connect(
                 accounts[1]
              );

              await expect(
                 attackerConnectedContract.withdraw()
              ).to.be.revertedWithCustomError(
                 attackerConnectedContract,
                 "FundMe__NotOwner"
              );
           });

           it("Cheaper Withdraw funds from multiple funders", async function () {
              // Arrange
              const accounts = await ethers.getSigners();

              for (let i = 0; i < 6; i++) {
                 const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                 );
                 await fundMeConnectedContract.fund({ value: sendValue });
              }

              const startingContractBalance = await ethers.provider.getBalance(
                 await fundMe.getAddress()
              );

              const startingDeployerBalance = await ethers.provider.getBalance(
                 deployer
              );

              // Act
              const transactionResponce = await fundMe.cheaperWithdraw();
              const transactionReciept = await transactionResponce.wait(1);
              const { gasUsed, gasPrice } = transactionReciept;
              const gasCost = gasUsed * gasPrice;

              const endingContractBalance = await ethers.provider.getBalance(
                 await fundMe.getAddress()
              );
              const endingDeployerBalance = await ethers.provider.getBalance(
                 deployer
              );

              // Assert
              assert.equal(endingContractBalance, 0);
              assert.equal(
                 (endingDeployerBalance + gasCost).toString(),
                 (startingDeployerBalance + startingContractBalance).toString()
              );

              await expect(fundMe.getFunder(0)).to.be.reverted;

              for (let i = 0; i < 6; i++) {
                 assert.equal(
                    await fundMe.getAddressToAmountFunded(accounts[i].address),
                    0
                 );
              }
           });
        });
     });
