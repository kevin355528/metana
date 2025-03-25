// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/structs/BitMaps.sol";
import "@openzeppelin/contracts/utils/Multicall.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Advanced NFT Contract
/// @notice Implements an NFT with Merkle Tree based airdrop, commit-reveal for random NFT ID, and custom error handling.
/// @author Marko Jauregui
contract AdvancedNFT is ERC721, Pausable, Multicall, Ownable, ReentrancyGuard {
    using BitMaps for BitMaps.BitMap;

    // Enums
    enum SaleState {
        Presale,
        PublicSale,
        SoldOut
    }

    // Custom Errors
    error AdvancedNFT__InvalidMerkleProof();
    error AdvancedNFT__TokenAlreadyMinted();
    error AdvancedNFT__AlreadyRevealed();
    error AdvancedNFT__InvalidReveal();
    error AdvancedNFT__RevealTooEarly();
    error AdvancedNFT__RevealTooLate();
    error AdvancedNFT__InsufficientBalance();
    error AdvancedNFT__NotInCorrectSaleState();

    // State Variables
    BitMaps.BitMap private s_minted;
    bytes32 public s_merkleRoot;
    mapping(address => Commit) public s_commits;
    SaleState public s_saleState;

    // Structs
    /// @notice Commit struct for the commit-reveal scheme
    struct Commit {
        bytes32 commit;
        uint64 blockNumber;
        bool revealed;
    }

    // Events
    event CommitEvent(
        address indexed sender,
        bytes32 indexed commitHash,
        uint64 blockNumber
    );
    event RevealEvent(
        address indexed sender,
        bytes32 secret,
        bytes32 finalRandom
    );

    // Modifiers
    modifier inSaleState(SaleState _state) {
        if (s_saleState != _state) {
            revert AdvancedNFT__NotInCorrectSaleState();
        }
        _;
    }

    // Constructor
    constructor(
        string memory name,
        string memory symbol,
        bytes32 _merkleRoot,
        address initialOwner
    ) ERC721(name, symbol) Ownable(initialOwner) {
        s_merkleRoot = _merkleRoot;
        s_saleState = SaleState.Presale;
    }

    // Functions
    function mintWithMerkleProof(
        bytes32[] calldata _merkleProof,
        uint256 _tokenId
    ) public whenNotPaused inSaleState(SaleState.PublicSale) {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        if (!MerkleProof.verify(_merkleProof, s_merkleRoot, leaf)) {
            revert AdvancedNFT__InvalidMerkleProof();
        }
        if (s_minted.get(_tokenId)) {
            revert AdvancedNFT__TokenAlreadyMinted();
        }
        s_minted.set(_tokenId);
        _mint(msg.sender, _tokenId);
    }

    function commit(bytes32 _dataHash) public {
        Commit storage userCommit = s_commits[msg.sender];
        userCommit.commit = _dataHash;
        userCommit.blockNumber = uint64(block.number);
        userCommit.revealed = false;
        emit CommitEvent(msg.sender, _dataHash, userCommit.blockNumber);
    }

    function reveal(bytes32 _secret) public {
        Commit storage userCommit = s_commits[msg.sender];
        if (userCommit.revealed) {
            revert AdvancedNFT__AlreadyRevealed();
        }
        if (userCommit.blockNumber >= block.number) {
            revert AdvancedNFT__RevealTooEarly();
        }
        if (userCommit.blockNumber + 250 < block.number) {
            revert AdvancedNFT__RevealTooLate();
        }
        if (keccak256(abi.encodePacked(_secret)) != userCommit.commit) {
            revert AdvancedNFT__InvalidReveal();
        }
        userCommit.revealed = true;
        bytes32 finalRandom = keccak256(
            abi.encodePacked(blockhash(userCommit.blockNumber), _secret)
        );
        emit RevealEvent(msg.sender, _secret, finalRandom);
    }

    function startPublicSale() external onlyOwner {
        s_saleState = SaleState.PublicSale;
    }

    function endSale() external onlyOwner {
        s_saleState = SaleState.SoldOut;
    }

    function withdrawFunds(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) public onlyOwner nonReentrant {
        uint256 totalAmount = 0;
        for (uint i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        if (address(this).balance < totalAmount) {
            revert AdvancedNFT__InsufficientBalance();
        }
        for (uint i = 0; i < recipients.length; i++) {
            payable(recipients[i]).transfer(amounts[i]);
        }
    }

    // Fallbacks
    receive() external payable {}
}
