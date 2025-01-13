// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

error ERC1155__CooldownNotElapsed();
error ERC1155__InvalidTokenForTrade();
error ERC1155__NotTokenOwnerOrForgeContract();
error ERC1155__InvalidTokenForBurn();
error ERC1155__NotAMinter();

contract cERC1155 is ERC1155, AccessControl {

    uint256 public constant TOKEN_ID_0 = 0;
    uint256 public constant TOKEN_ID_1 = 1;
    uint256 public constant TOKEN_ID_2 = 2;

     /// @notice Role identifier for minters
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Cooldown time for minting tokens 0-2
    uint256 public constant COOLDOWN_TIME = 1 minutes;

    // Storage variables
    address private s_forgingContract;
    mapping(address => mapping(uint256 => uint256)) private s_lastMintTimestamp;

    event Minted(address indexed user, uint256 indexed tokenId, uint256 amount);
    event Burned(address indexed user, uint256 indexed tokenId, uint256 amount);
    event Traded(
        address indexed user,
        uint256 indexed tokenIdSold,
        uint256 indexed tokenIdBought,
        uint256 amount
    );

    constructor()
        ERC1155("ipfs://QmdpEYwJircF4qH5imJG4bJT3TH6rNYxzCL2d8B4bG7Uhy/{id}") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

     function mint(address account, uint256 tokenId, uint256 amount) public {
        if (tokenId <= TOKEN_ID_2) {
            if (block.timestamp - s_lastMintTimestamp[msg.sender][tokenId] < COOLDOWN_TIME) 
                revert ERC1155__CooldownNotElapsed();

                s_lastMintTimestamp[msg.sender][tokenId] = block.timestamp;
        } else {
            if (!hasRole(MINTER_ROLE, msg.sender))
                revert ERC1155__NotAMinter();
        }

        _mint(account, tokenId, amount, "");
        emit Minted(msg.sender, tokenId, amount);
    }

    /**
     * @notice Allows users to trade tokens 3-6 for tokens 0-2.
     * @param tokenId The ID of the token to trade.
     * @param desiredToken The ID of the desired token.
     */
    function tradeToken(uint256 tokenId, uint256 desiredToken, uint256 amount) public {
        if (!(tokenId >= 3 && tokenId <= 6))
            revert ERC1155__InvalidTokenForTrade();
        if (!(desiredToken >= TOKEN_ID_0 && desiredToken <= TOKEN_ID_2))
            revert ERC1155__InvalidTokenForTrade();

        _burn(msg.sender, tokenId, amount);
        mint(msg.sender, desiredToken, amount);
        emit Traded(msg.sender, tokenId, desiredToken, amount);
    }

    /**
     * @notice Allows burning of tokens.
     * @param tokenId The ID of the token to burn.
     * @param amount The number of tokens to burn.
     */
    function burn(address account, uint256 tokenId, uint256 amount) public {
        _burn(account, tokenId, amount);
        emit Burned(account, tokenId, amount);
    }

    /**
     * @notice Sets the address of the forging contract.
     * @param _forgingContract The address of the forging contract.
     */
    function setForgingContract(address _forgingContract) public {
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Not an admin");

        if (s_forgingContract != address(0)) {
            revokeRole(MINTER_ROLE, s_forgingContract);
        }

        s_forgingContract = _forgingContract;
        grantRole(MINTER_ROLE, s_forgingContract);
    }

    /**
     * @dev Overrides the supportsInterface function to rectify function selector clashes.
     * @param interfaceId The ID of the interface to check.
     */
    function supportsInterface(bytes4 interfaceId) public view override(ERC1155, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @notice Retrieves the last mint timestamp for a user's specific token.
     * @param user The address of the user.
     * @param tokenId The ID of the token.
     */
    function getLastMintTimestamp(address user, uint256 tokenId) external view returns (uint256) {
        return s_lastMintTimestamp[user][tokenId];
    }

}