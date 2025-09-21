// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Honeypot {
    mapping(address => uint256) public deposits;

    // users deposit ETH
    function deposit() public payable {
        deposits[msg.sender] += msg.value;
    }

    // scammy withdraw function - looks like it should work, but always fails
    function withdraw() public {
        require(false, "Withdrawal not allowed! This is a honeypot trap.");
    }
}
