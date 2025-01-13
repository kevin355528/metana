const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Deploy CirclesERC1155 contract
  const cERC1155 = await ethers.getContractFactory("cERC1155");
  const ERC1155 = await cERC1155.deploy();
  await ERC1155.deployed();

  console.log("ERC1155 contract deployed to:", ERC1155.address);

  // Deploy CirclesForge contract with the address of CirclesERC1155
  const forge = await ethers.getContractFactory("Forge");
  const Forge = await forge.deploy(ERC1155.address);
  await Forge.deployed();

  console.log("Forge contract deployed to:", Forge.address);

  // Set CirclesForge as the forging contract in CirclesERC1155
  await ERC1155.setForgingContract(Forge.address);
  console.log("Set Forge as the forging contract in ERC1155");

  // Grant minting rights to CirclesForge contract
  await ERC1155.grantRole(ERC1155.MINTER_ROLE(), Forge.address);
  console.log("Granted minting rights to Forge contract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
