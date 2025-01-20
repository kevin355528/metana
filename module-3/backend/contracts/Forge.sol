// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./ERC1155.sol";

contract Forge {
    // Custom Errors
    error __InsufficientToken0();
    error __InsufficientToken1();
    error __InsufficientToken2();

    // Constants for token IDs
    uint256 public constant TOKEN_ID_0 = 0;
    uint256 public constant TOKEN_ID_1 = 1;
    uint256 public constant TOKEN_ID_2 = 2;
    uint256 public constant TOKEN_ID_3 = 3;
    uint256 public constant TOKEN_ID_4 = 4;
    uint256 public constant TOKEN_ID_5 = 5;
    uint256 public constant TOKEN_ID_6 = 6;

    // Storage: Instance of the ERC1155 contract
    erc1155 private _erc1155Contract;

    // Events
    event TokenForged(address indexed user, uint256 indexed tokenId, uint256 indexed amount);

    /**
     * @dev Constructor that sets the address of the erc1155 contract.
     * @param _erc1155Address The address of the ercERC1155 contract.
     */
    constructor(address _erc1155Address) {
        _erc1155Contract = erc1155(_erc1155Address);
    }

    /**
     * @notice Forges Token 3 by burning tokens 0 & 1.
     * @param _amount The amount of tokens to be burned in exchange for the same amount of forged tokens.
     */
    function forgeToken3(uint256 _amount) external {
        if (_erc1155Contract.balanceOf(msg.sender, TOKEN_ID_0) < _amount) {
            revert __InsufficientToken0();
        }
        if (_erc1155Contract.balanceOf(msg.sender, TOKEN_ID_1) < _amount) {
            revert __InsufficientToken1();
        }

        _erc1155Contract.burn(msg.sender, TOKEN_ID_0, _amount);
        _erc1155Contract.burn(msg.sender, TOKEN_ID_1, _amount);
        _erc1155Contract.mint(msg.sender, TOKEN_ID_3, _amount);

        emit TokenForged(msg.sender, TOKEN_ID_3, _amount);
    }

    /**
     * @notice Forges Token 4 by burning Tokens 1 & 2.
     * @param _amount The number of tokens to forge.
     */
    function forgeToken4(uint256 _amount) external {
        if (_erc1155Contract.balanceOf(msg.sender, TOKEN_ID_1) < _amount) {
            revert __InsufficientToken1();
        }
        if (_erc1155Contract.balanceOf(msg.sender, TOKEN_ID_2) < _amount) {
            revert __InsufficientToken2();
        }

        _erc1155Contract.burn(msg.sender, TOKEN_ID_1, _amount);
        _erc1155Contract.burn(msg.sender, TOKEN_ID_2, _amount);
        _erc1155Contract.mint(msg.sender, TOKEN_ID_4, _amount);

        emit TokenForged(msg.sender, TOKEN_ID_4, _amount);
    }

    /**
     * @notice Forges Token 5 by burning tokens 0 & 2.
     * @param _amount The number of tokens to forge.
     */
    function forgeToken5(uint256 _amount) external {
        if (_erc1155Contract.balanceOf(msg.sender, TOKEN_ID_0) < _amount) {
            revert __InsufficientToken0();
        }
        if (_erc1155Contract.balanceOf(msg.sender, TOKEN_ID_2) < _amount) {
            revert __InsufficientToken2();
        }

        _erc1155Contract.burn(msg.sender, TOKEN_ID_0, _amount);
        _erc1155Contract.burn(msg.sender, TOKEN_ID_2, _amount);
        _erc1155Contract.mint(msg.sender, TOKEN_ID_5, _amount);

        emit TokenForged(msg.sender, TOKEN_ID_5, _amount);
    }

    /**
     * @notice Forges Token 6 by burning tokens 0, 1, & 2.
     * @param _amount The number of tokens to forge.
     */
    function forgeToken6(uint256 _amount) external {
        if (_erc1155Contract.balanceOf(msg.sender, TOKEN_ID_0) < _amount) {
            revert __InsufficientToken0();
        }
        if (_erc1155Contract.balanceOf(msg.sender, TOKEN_ID_1) < _amount) {
            revert __InsufficientToken1();
        }
        if (_erc1155Contract.balanceOf(msg.sender, TOKEN_ID_2) < _amount) {
            revert __InsufficientToken2();
        }

        _erc1155Contract.burn(msg.sender, TOKEN_ID_0, _amount);
        _erc1155Contract.burn(msg.sender, TOKEN_ID_1, _amount);
        _erc1155Contract.burn(msg.sender, TOKEN_ID_2, _amount);
        _erc1155Contract.mint(msg.sender, TOKEN_ID_6, _amount);

        emit TokenForged(msg.sender, TOKEN_ID_6, _amount);
    }
}