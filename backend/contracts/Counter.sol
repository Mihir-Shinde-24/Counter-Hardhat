// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";


contract Counter {
    uint256 private count;
    
    constructor() {
        count = 0;
    }
    
    function increment() public returns (uint256) {
        count += 1;
        return count;
    }
    
    function getCount() public view returns (uint256) {
        return count;
    }
}
