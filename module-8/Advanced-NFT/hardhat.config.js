require("@nomiclabs/hardhat-waffle"); // Waffle plugin
require("@nomiclabs/hardhat-ethers"); // Ethers plugin
require("hardhat-gas-reporter"); // Gas Reporter
require("solidity-coverage"); // Solidity Coverage

// You can add more plugins here if you need them

module.exports = {
  solidity: "0.8.20",
  networks: {
    // Define your network configurations here if needed
    sepolia: {
      url: "https://sepolia.infura.io/v3/b64e582aca814a4f859e7461fc66f713",
      accounts: [
        "a5129758a0d28b9717a05c82c3f3da16e3cf3e185841ecc5b3ba0e73072e2d1d",
      ],
    },
  },

  gasReporter: {
    // Gas reporter configuration
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  // Additional configurations can be added here
};
