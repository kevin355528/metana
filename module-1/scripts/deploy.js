const { ethers, upgrades } = require("hardhat");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("DEPLOYER:");
  console.log("Deploying contracts with the account: ", deployer.address);
  console.log(
    "Account balance:                      ",
    (await deployer.provider.getBalance(deployer.address)).toString()
  );

  const myToken = await ethers.getContractFactory("MyToken");
  const instance = await upgrades.deployProxy(myToken);
  await instance.deployed();

  console.log("ERC20 deployed contract address: ", instance.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
