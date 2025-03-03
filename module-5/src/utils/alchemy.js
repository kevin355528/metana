import { Alchemy, Network } from "alchemy-sdk";

const settings = {
  apiKey: "0bzbJljtiEH10pD59JvQEPCTFVe_dbYC",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

export default alchemy;
