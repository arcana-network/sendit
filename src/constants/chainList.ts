const chains = {
  1: {
    name: "Ethereum",
    chain_id: 1,
    rpc_url: "https://rpc.ankr.com/eth",
    blockchain: "eth",
    currency: "ETH",
  },
  137: {
    name: "Polygon",
    chain_id: 137,
    rpc_url: "https://rpc.ankr.com/polygon",
    blockchain: "polygon",
    currency: "MATIC",
  },
  80001: {
    name: "Polygon Mumbai",
    chain_id: 80001,
    rpc_url: "https://rpc.ankr.com/polygon_mumbai",
    blockchain: "polygon_mumbai",
    currency: "MATIC",
  },
  42161: {
    name: "Arbitrum One",
    blockchain: "arbitrum",
    chain_id: 42161,
    rpc_url: "https://rpc.ankr.com/arbitrum",
    currency: "ETH",
  },
  56: {
    name: "BNB Smart Chain",
    blockchain: "bsc",
    chain_id: 56,
    rpc_url: "https://rpc.ankr.com/bsc",
    currency: "BNB",
  },
  97: {
    name: "BNB Smart Chain Testnet",
    blockchain: "bsc_testnet_chapel",
    chain_id: 97,
    rpc_url: "https://rpc.ankr.com/bsc_testnet_chapel",
    currency: "tBNB",
  },
};

export const testnetChains = [80001, 97];

export const testnetChainFaucets = {
  97: "https://testnet.binance.org/faucet-smart",
  80001: "https://mumbaifaucet.com",
};

export default chains;
