# Ethereum Gas Metrics Visualization

This project is a visualization tool for analyzing Ethereum gas metrics, specifically focusing on the ERC20 transfers volume, the base fee, and the gas ratio in the last 10 blocks.

## Features

1. ERC20 Transfers Volume: Displays the total USDC transfers volume for the last 10 blocks.
2. Base Fee: Visualizes the base fee for the last 10 blocks.
3. Gas Ratio: Shows the ratio of gas used to gas limit for the last 10 blocks in percentage.

## Implementation

#### Frontend: Built using React/Next.js

#### Charting Library: Uses ApexCharts for visualization.

#### Ethereum Data Fetching: Uses the Alchemy SDK for fetching data from the Ethereum blockchain.

## How to Run

1. Clone the repository.
2. Install the dependencies using npm install.
3. Set up your .env.local with the Alchemy API key:

```
NEXT_ALCHEMY_RPC_URL=Your_Alchemy_API_Key
```

4. Run the project using npm run dev.
