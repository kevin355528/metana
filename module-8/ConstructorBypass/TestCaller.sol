// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Interface for the Caller contract
interface ICaller {
    function callConstructorBypass() external;
}

// TestCaller contract to interact with the Caller contract
contract TestCaller {
    ICaller public callerContract;

    // Constructor takes the address of the deployed Caller contract
    constructor(address _callerContractAddress) {
        callerContract = ICaller(_callerContractAddress);
    }

    // Function to test the callConstructorBypass function of the Caller contract
    function testCall() public {
        callerContract.callConstructorBypass();
    }
}
