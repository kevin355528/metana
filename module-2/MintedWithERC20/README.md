# NFT with ERC20 Token Minting

This project encompasses the deployment and interaction of three smart contracts, enabling the minting of NFT tokens using a specific ERC20 token. The guide below outlines the steps to deploy and interact with these contracts using Remix IDE.

## Deployment and Interaction Steps:

### 1. Deployment of ERC20 and ERC721 Contracts
- Deploy `ERC20Token.sol` (ERC20 contract).
- Deploy `ERC721Token.sol` (ERC721 contract).

### 2. Deployment of Minter Contract
- Deploy `receiveERC20.sol` and provide the addresses of the contracts deployed in step 1 as constructor parameters.


### 3. Approving ERC20 Tokens
- In the `ERC20Token` contract, call the `approve` function, passing the Minter contract address and the amount you wish to approve.

Example: Approve 10 tokens for the Minter Contract
```
  _Token.approve(msg.sender, address(this), 10**19);
```


### 4. Setting Minter Contract in ERC721
- In the `ERC721Token` contract, call the `setMinterContract` function to set the Minter contract as the authorized minter.


### 5. Minting NFT
- Now, call the `mintNFT` function in the Minter contract to mint a new NFT.


### Verification
- You can verify the minting by checking the balance of the Minter contract in the NFT contract or by querying the owner of the newly minted token.
