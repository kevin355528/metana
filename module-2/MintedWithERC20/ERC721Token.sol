// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

contract NFTContract is ERC721("NFTContract", "MTK721"), Ownable2Step {

    uint256 public tokenSupply = 0;
    uint256 public constant MAX_VALUE = 5;
    uint256 public constant PRICE = 0.00001 ether; 
    address public minterContract;

    address immutable deployer;

    constructor(address initialOwner) Ownable(initialOwner) {
        deployer = msg.sender;
    }

    function mint() external payable {
        require(tokenSupply < MAX_VALUE, "supply used ");
        _mint(msg.sender, tokenSupply);
        tokenSupply++;
    }

    function setMinterContract(address _minterContract) external onlyOwner {
        minterContract = _minterContract;
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