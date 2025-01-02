// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "contracts/MintedWithERC20/ERC20Token.sol";
import "contracts/MintedWithERC20/ERC721Token.sol";

contract receiveERC20 {
     address public immutable owner;
     MyToken private immutable _Token;
     NFTContract private immutable _NftContract; 

     constructor(address myTokenAddress, address myNftContractAddress) {
        owner = msg.sender;
        _Token = MyToken(myTokenAddress);
        _NftContract = NFTContract(myNftContractAddress);

     }

     function mintToken() external {
        _Token.mintToken(msg.sender, 10**19);
    }

     function mintNft() external {
        uint256 tokenAllowance = _Token.allowance(msg.sender, address(this));
        require(tokenAllowance == 10**19, "Token withdrawal not approved!");
        bool isTransfer = _Token.transferFrom(msg.sender, address(this), tokenAllowance);
        if(isTransfer) {
            _NftContract.mint();
        }
     }
}