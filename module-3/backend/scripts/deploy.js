const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  // Deploy ERC1155 contract
  const erc1155 = await ethers.getContractFactory("erc1155");
  const ERC1155 = await erc1155.deploy();
  await ERC1155.waitForDeployment();

  console.log("ERC1155 contract deployed to:", ERC1155.target);

  // Deploy Forge contract with the address of ERC1155
  const forge = await ethers.getContractFactory("Forge");
  const Forge = await forge.deploy(ERC1155.target);
  await Forge.waitForDeployment();

  console.log("Forge contract deployed to:", Forge.target);

  // Set Forge as the forging contract in ERC1155
  await ERC1155.setForgingContract(Forge.target);
  console.log("Set Forge as the forging contract in ERC1155");

  // Grant minting rights to Forge contract
  await ERC1155.grantRole(ERC1155.MINTER_ROLE(), Forge.target);
  console.log("Granted minting rights to Forge contract");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
