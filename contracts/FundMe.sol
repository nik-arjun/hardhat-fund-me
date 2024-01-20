// Get Funds from User
// Withdraw Funds
// Set a minimum funding value in USD

// SPDX-License-Identifier: MIT
// Pragma
pragma solidity ^0.8.13;
// Imports
// import "hardhat/console.sol";
import "./PriceConverter.sol";

// 756935 gas
// 737202 gas (After adding constant keyword)

// Error Codes
error FundMe__NotOwner();

// Interfaces, Libraries, Contracts

/**
 * @title A contract for crowd Funding
 * @author Nikhil
 * @notice This contract is to demo a simple Crowd Funding Contract
 * @dev    This implements price feeds as our Library
 */

contract FundMe {
   // Type Declarations
   using PriceConverter for uint256;

   // State Variables
   uint256 public constant MINIMUM_USD = 50 * 1e18;
   // 2571 gas
   // 347 gas (After adding constant keyword)
   address private immutable i_owner;
   // 2549 gas
   // 439 gas (After adding immutable keyword)
   address[] private s_funders;
   mapping(address => uint256) private s_addressToAmount;

   AggregatorV3Interface private s_priceFeed;

   // Modifier
   modifier onlyOwner() {
      // require(msg.sender == i_owner, "Sender is not the Owner");
      if (msg.sender != i_owner) revert FundMe__NotOwner();
      _; // Tells the function to execute the remaining Code.
   }

   constructor(AggregatorV3Interface priceFeedAddress) {
      i_owner = msg.sender;
      s_priceFeed = AggregatorV3Interface(priceFeedAddress);
   }

   receive() external payable {
      fund();
   }

   fallback() external payable {
      fund();
   }

   /**
    * @notice  This Function funds this contract
    * @dev     This implements pricefeed as our Library
    */
   function fund() public payable {
      // Want to be able to set a minimum fund amount in USD
      // 1. How do we send ETH to this contract ?

      require(
         msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
         "Don't have enough Balance"
      );
      //require(getConversionRate(msg.value) >= MINIMUM_USD,"Don't have enough Balance,");
      // 18 decimal places

      s_funders.push(msg.sender);
      s_addressToAmount[msg.sender] = msg.value;

      // console.log(
      //    "Funder with address %s have successfully funded %s",
      //    msg.sender,
      //    msg.value
      // );
   }

   function withdraw() public onlyOwner {
      for (
         uint256 funderIndex = 0;
         funderIndex < s_funders.length;
         funderIndex++
      ) {
         address funder = s_funders[funderIndex];

         s_addressToAmount[funder] = 0;
      }

      // reset the array
      s_funders = new address[](0);

      // console.log(
      //    "Owner with address %s have completely withrawn %s",
      //    msg.sender,
      //    address(this).balance
      // );

      // actually withdraw the fund

      /* Methods to transfer money */
      // transfer
      // payable(msg.sender).transfer(address(this).balance);
      // send
      // bool sendSuccess = payable(msg.sender).send(address(this).balance);
      // require(sendSuccess,"Call Failed");

      // The Above 2 is capped at 2300 gas and above that will throw error

      // call
      (bool callSuccess /* bool memory dataReturned */, ) = i_owner.call{
         value: address(this).balance
      }("");
      require(callSuccess, "Call Failed");
   }

   /* modifier onlyOwner {
        _; // Tells the function to execute the remaining Code first.
        require(msg.sender == owner, "Sender is not the Owner");
    }*/

   function cheaperWithdraw() public onlyOwner {
      address[] memory funders = s_funders;

      for (
         uint256 funderIndex = 0;
         funderIndex < funders.length;
         funderIndex++
      ) {
         address funder = funders[funderIndex];
         s_addressToAmount[funder] = 0;
      }

      s_funders = new address[](0);

      (bool callSuccess, ) = i_owner.call{value: address(this).balance}("");
      require(callSuccess, "Call Failed");
   }

   // View/Pure Functions
   function getOwner() public view returns (address) {
      return i_owner;
   }

   function getFunder(uint256 index) public view returns (address) {
      return s_funders[index];
   }

   function getAddressToAmountFunded(
      address funder
   ) public view returns (uint256) {
      return s_addressToAmount[funder];
   }

   function getPricefeed() public view returns (AggregatorV3Interface) {
      return s_priceFeed;
   }
}

// $1885.995833960000000000
