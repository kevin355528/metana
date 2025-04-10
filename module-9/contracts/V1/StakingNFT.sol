// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "contracts/V1/ERC20Token.sol";
import "contracts/V1/ERC721Token.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract StakingNFT is Initializable,
    OwnableUpgradeable,
    ReentrancyGuardUpgradeable,
    IERC721ReceiverUpgradeable {

    error StakingContract__NotTokenOwner();
    error StakingContract__TooEarlyToWithdraw();
    error StakingContract__NotNFTOwner();

    mapping(uint256 => address) public _tokenOwner;

    mapping(uint256 => uint256) public _lastWithdrawTime;

    address public  _owner;
    MyToken private  _Token;
    NFTContract private  _NftContract; 

    function initialize(
        address myTokenAddress,
        address myNftContractAddress
    ) public initializer {
        __Ownable_init(_owner);
        __ReentrancyGuard_init();
        _Token = MyToken(myTokenAddress);
        _NftContract = NFTContract(myNftContractAddress);
    }

    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external override returns (bytes4) {
        _tokenOwner[tokenId] = from;
        _lastWithdrawTime[tokenId] = block.timestamp;
        return this.onERC721Received.selector;
    }

    function stakeNFT(uint256 tokenId) external {
        if (msg.sender != _NftContract.ownerOf(tokenId))
            revert StakingContract__NotNFTOwner();
        _NftContract.safeTransferFrom(msg.sender, address(this), tokenId);
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