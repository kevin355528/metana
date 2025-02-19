// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract MyToken is ERC20, ERC20Permit {
    constructor() ERC20("MyToken", "MTK") ERC20Permit("MyToken") {
        _mint(msg.sender, 10000 * (10 ** uint256(decimals())));
    }

    function mintToken(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function approve(address owner, address spender, uint256 amount) external returns (bool) {
        _approve(owner, spender, amount);
        return true;
    }
}

