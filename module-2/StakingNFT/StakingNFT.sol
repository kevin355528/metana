// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "contracts/StakngNFT/ERC20Token.sol";
import "contracts/StakngNFT/ERC721Token.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract StakingNFT is IERC721Receiver, ReentrancyGuard {

    error StakingContract__TooEarlyToWithdraw();

    mapping(uint256 => address) public _tokenOwner;

    mapping(uint256 => uint256) public _lastWithdrawTime;

    address public immutable owner;
    MyToken private immutable _Token;
    NFTContract private immutable _NftContract; 

    constructor(address myTokenAddress, address myNftContractAddress) {
        owner = msg.sender;
        _Token = MyToken(myTokenAddress);
        _NftContract = NFTContract(myNftContractAddress);
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external override returns (bytes4) {
        _tokenOwner[tokenId] = from;
        _lastWithdrawTime[tokenId] = block.timestamp;
        return this.onERC721Received.selector;
    }

    function withdrawERC20(uint256 tokenId) external nonReentrant  {
        require(_tokenOwner[tokenId] != msg.sender, "Not token owner");
        if(block.timestamp < _lastWithdrawTime[tokenId] + 1 days) revert StakingContract__TooEarlyToWithdraw();
        _Token.transfer(msg.sender, 10 * (10 ** uint256(_Token.decimals())));
        _lastWithdrawTime[tokenId] = block.timestamp;
    }

    function unstakeNFT(uint256 tokenId) external nonReentrant  {
         require(_tokenOwner[tokenId] != msg.sender, "Not token owner");
         _NftContract.safeTransferFrom(address(this), msg.sender, tokenId);
        delete _tokenOwner[tokenId];
        delete _lastWithdrawTime[tokenId];
    }



}