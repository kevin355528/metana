// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Demonstrates the extcodesize bypass in the constructor.
 */
contract ConstructorBypass {
    bool public isContract;

    constructor() {
        // During construction, extcodesize for this contract is 0
        isContract = address(this).code.length > 0;
    }
}

/**
 * @dev Demonstrates blocking calls from the constructor using msg.sender == tx.origin.
 */
contract Caller {
    bool public directCallBlocked;
    bool public isBypassContract;

    function callConstructorBypass() public {
        ConstructorBypass bypass = new ConstructorBypass();
        isBypassContract = bypass.isContract();

        // If this function is called by a contract, tx.origin will differ from msg.sender
        directCallBlocked = msg.sender != tx.origin;
    }
}
