// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFTContract is ERC721("MyToken721", "MTK721"), Ownable2Step {

    uint256 public tokenSupply = 0;
    uint256 public constant MAX_VALUE = 8;
    uint256 public constant PRICE = 0.00001 ether; 

    address immutable deployer;

    constructor(address initialOwner) Ownable(initialOwner) {
        deployer = msg.sender;
    }

    function mint() external payable {
        require(tokenSupply < MAX_VALUE, "supply used ");
        _mint(msg.sender, tokenSupply);
        tokenSupply++;
    }

    function viewBalance() external view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() external {
        payable(deployer).transfer(address(this).balance);
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "ERC721Metadata: URI query for nonexistent token");

        string memory baseURI = _baseURI();
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, Strings.toString(tokenId))) : "";
    }

    function _baseURI() internal pure override  returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/bafybeifiwfhv6khabpnpm4niryzpwegw6hi5ncg4nte7gvsqqxam2hpvwq/";
    }

}