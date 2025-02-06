# NFT Staking Smart Contract

This project consists of three contracts: an ERC20 token, an ERC721 token, and a Staking contract, allowing users to stake their NFTs and earn ERC20 tokens as rewards. Users can withdraw their rewards periodically and can unstake their NFTs at any time.

## Deployment and Interaction Steps

### 1. Deployment

- Deploy the `ERC20Token` contract. This will create the ERC20 token used for rewards.
- Deploy the `ERC721Token` contract. This will create the ERC721 token that users will stake.
- Deploy the `StakingNFT` contract with the addresses of the previously deployed `ERC20Test` and `CirclesNFT` as constructor parameters.

### 2. Minting NFT

- Interact with the `ERC721Token` contract and call the `mint` function to create a new NFT.

### 3. Approving Transfers

#### Approving NFT Transfer
- Before staking the NFT, call the `setApprovalForAll` function on the `ERC721Token` contract.
- Set the `operator` address as the address of the `StakingNFT` contract.
- Set `approved` as `true`.

### 4. Transferring ERC20 Tokens to the Staking Contract

- Transfer a sufficient amount of ERC20 tokens to the `StakingNFT` contract by calling the `transfer` function on the `ERC20Token` contract.
- Set the `recipient` as the address of the `StakingNFT` contract.
- Set the `amount` as the amount of tokens you want to transfer, keeping in mind the decimal places of the token.

### 5. Staking the NFT

- Call the `safeTransferFrom` function on the `ERC721Token` contract to stake the NFT.
- Set the `from` as your address, the `to` as the address of the `StakingNFT` contract, and the `tokenId` as the ID of the NFT you want to stake.

### 6. Withdrawing ERC20 Rewards

- After the specified duration, call the `withdrawERC20` function on the `StakingNFT` contract, passing the ID of the staked NFT, to withdraw your ERC20 rewards.

### 7. Unstaking the NFT

- Call the `unstakeNFT` function on the `StakingNFT` contract, passing the ID of the staked NFT, whenever you want to unstake your NFT.

### 8. Verifying Balances and Ownership

- After each interaction, verify the balances of ERC20 tokens and the ownership of the NFTs by calling the respective functions on the `ERC20Token` and `ERC721Token` contracts.
