require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();
const { INFURA_ENDPOINT, MNEMONIC } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",

  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/b64e582aca814a4f859e7461fc66f713",
      accounts: [
        "a5129758a0d28b9717a05c82c3f3da16e3cf3e185841ecc5b3ba0e73072e2d1d",
      ],
    },
  },
};
