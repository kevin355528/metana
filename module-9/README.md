# NFT Staking Project

This project demonstrates a decentralized application (dApp) that includes an NFT contract (`CirclesNFT`) and it's upgrade (`CirclesNFTV2`), an ERC20 token (`ERC20Test`), and a staking contract (`NFTStaking`). The NFT contract, initially deployed as `CirclesNFT`, has been upgraded to include a "god mode" feature, allowing forced transfers of NFTs by the contract owner.

## Contracts

### CirclesNFT

- **Description:** The original NFT contract with standard ERC721 functionalities. Designed with upgradeability in mind to allow for future enhancements.
- **Network:** Sepolia
- **Upgradability:** Implemented using OpenZeppelin's upgradeable contracts pattern.

### CirclesNFTV2

- **Description:** An upgradeable NFT contract that includes standard ERC721 functionalities along with a "god mode" feature for administrative transfers.
- **Network:** Sepolia
- **Contract Address:** [0xcbd297293f1f81e6d5959de4b895ad6cf87b2e5b](https://sepolia.etherscan.io/address/0xcbd297293f1f81e6d5959de4b895ad6cf87b2e5b#code)
- **Features:** Minting NFTs, transferring NFTs, and "god mode" transfers.

### ERC20Test

- **Description:** A standard ERC20 token used within the ecosystem for transactions and rewards.
- **Network:** Sepolia
- **Contract Address:** [0xb8E9408a525E2Bee59eECDeAcd3123116Fc78A10](https://sepolia.etherscan.io/address/0xb8E9408a525E2Bee59eECDeAcd3123116Fc78A10#code)
- **Features:** ERC20 token functionalities.

### NFTStaking

- **Description:** A staking contract that allows users to stake their NFTs and earn ERC20 token rewards.
- **Network:** Sepolia
- **Contract Address:** [0xFde3f0550Cd3999085e570c36E4a553619eb4c47](https://sepolia.etherscan.io/address/0xFde3f0550Cd3999085e570c36E4a553619eb4c47#code)
- **Features:** Staking NFTs, withdrawing rewards, and unstaking.

## Development and Testing

- **Tools Used:** Solidity, Hardhat, Ethers.js.
- **Testing:** Integration tests cover the primary functionalities, including the upgrade process of the NFT contract.

## Deployment

- **Network:** Contracts were deployed and tested on the Sepolia testnet.
- **Upgrade Process:** Demonstrated an upgrade of the `CirclesNFT` contract to `CirclesNFTV2` using OpenZeppelin's upgradeable contracts pattern.
