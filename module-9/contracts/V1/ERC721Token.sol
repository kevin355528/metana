// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract NFTContract is Initializable, ERC721Upgradeable, OwnableUpgradeable {
    error _MaxSupplyReached();
    error _WrongMintingPrice();

    uint256 public tokenSupply = 0;
    uint256 public constant MAX_VALUE = 5;
    uint256 public constant PRICE = 0.00001 ether; 
    address public stakingContract;

    address immutable deployer;

    function initialize() public initializer {
        __ERC721_init("Circles NFT", "o");
        __Ownable_init(msg.sender);
        tokenSupply = 0;
    }

    function mint() external payable {
        if (tokenSupply >= MAX_VALUE) revert _MaxSupplyReached();
        if (msg.value != PRICE) revert _WrongMintingPrice();
        _mint(msg.sender, tokenSupply);
        tokenSupply++;
    }

    function setStakingContract(address _stakingContract) external onlyOwner {
        stakingContract = _stakingContract;
    }

    function viewBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() external {
        payable(deployer).transfer(address(this).balance);
    }

    function _baseURI() internal pure override  returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/bafybeifiwfhv6khabpnpm4niryzpwegw6hi5ncg4nte7gvsqqxam2hpvwq/";
    }

}