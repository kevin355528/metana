# Smart Contract Interaction Demonstration

## Overview

This repository contains two Solidity smart contracts designed to demonstrate specific behaviors in contract creation and interaction:

1. **Caller Contract**: Demonstrates the `extcodesize` bypass during the contract constructor phase and the use of `msg.sender` and `tx.origin` to detect calls from other contracts.

2. **TestCaller Contract**: Provides an example of interacting with the `Caller` contract from another contract.

## Setup and Deployment on Remix

### Prerequisites

- Access to [Remix Ethereum IDE](https://remix.ethereum.org/).

### Steps

#### Deploying the Caller Contract

1. **Create Contract File**:

   - In Remix, create a new file named `Caller.sol`.

   - Copy and paste the code for the `Caller` contract into this file.

2. **Compile the Contract**:

   - Use the Solidity Compiler in Remix to compile `Caller.sol`.

3. **Deploy the Contract**:

   - Go to the "Deploy & Run Transactions" panel.

   - Select the `Caller` contract from the dropdown menu.

   - Click "Deploy" to deploy the contract to the JavaScript VM or your chosen test network.

#### Deploying the TestCaller Contract

1. **Create Another Contract File**:

   - Create a new file named `TestCaller.sol`.

   - Copy and paste the code for the `TestCaller` contract into this file.

2. **Compile the TestCaller Contract**:

   - Compile `TestCaller.sol` using the Solidity Compiler in Remix.

3. **Deploy TestCaller**:

   - In the "Deploy & Run Transactions" panel, select `TestCaller`.

   - Provide the deployed address of the `Caller` contract when prompted.

   - Click "Deploy" to deploy `TestCaller`.

### Testing the Contracts

1. **Interact with TestCaller**:

   - In the deployed contracts panel, expand the `TestCaller` contract instance.

   - Click on the `testCall` function to execute it.

2. **Verify Caller Contract State**:

   - Expand the `Caller` contract instance in the deployed contracts panel.

   - Check the values of `directCallBlocked` and `isBypassContract`.

## Conclusion

This setup demonstrates important concepts in Ethereum smart contracts, including contract creation behaviors and interaction patterns between contracts.
