// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
   function getPrice(
      AggregatorV3Interface priceFeed
   ) internal view returns (uint256) {
      // ABI
      // Address 0x694AA1769357215DE4FAC081bf1f309aDC325306
      (
         ,
         /*uint80 roundId*/ int256 answer /*uint StartedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/,
         ,
         ,

      ) = priceFeed.latestRoundData();
      // ETH in terms of USD
      return uint256(answer * 1e10); // 1eth = 10**18 wei and eth to usd has 8 decimal places
   }

   function getDecimal() internal view returns (uint8) {
      AggregatorV3Interface priceFeed = AggregatorV3Interface(
         0x694AA1769357215DE4FAC081bf1f309aDC325306
      );
      return priceFeed.decimals();
   }

   function getVersion() internal view returns (uint256) {
      AggregatorV3Interface priceFeed = AggregatorV3Interface(
         0x694AA1769357215DE4FAC081bf1f309aDC325306
      );
      return priceFeed.version();
   }

   function getConversionRate(
      uint256 ethAmount,
      AggregatorV3Interface priceFeed
   ) internal view returns (uint256) {
      uint256 ethPrice = getPrice(priceFeed);
      uint256 ethAmountInUSD = (ethPrice * ethAmount) / 1e18;

      return ethAmountInUSD;
   }
}
