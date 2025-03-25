require('@nomiclabs/hardhat-waffle'); // Waffle plugin
require('@nomiclabs/hardhat-ethers'); // Ethers plugin
require('hardhat-gas-reporter'); // Gas Reporter
require('solidity-coverage'); // Solidity Coverage

// You can add more plugins here if you need them

module.exports = {
	solidity: '0.8.20',
	networks: {
		// Define your network configurations here if needed
		hardhat: {
			// Configuration for the Hardhat network (if any specific settings required)
		},
	},

	gasReporter: {
		// Gas reporter configuration
		enabled: process.env.REPORT_GAS !== undefined,
		currency: 'USD',
	},
	// Additional configurations can be added here
};
