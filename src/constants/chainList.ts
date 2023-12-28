const chains = {
  1: {
    name: "Ethereum",
    chain_id: 1,
    rpc_url: "https://rpc.ankr.com/eth",
    blockchain: "eth",
    currency: "ETH",
    explorer: "https://etherscan.io",
  },
  137: {
    name: "Polygon",
    chain_id: 137,
    rpc_url: "https://rpc.ankr.com/polygon",
    blockchain: "polygon",
    currency: "MATIC",
    explorer: "https://polygonscan.com",
  },
  80001: {
    name: "Polygon Mumbai",
    chain_id: 80001,
    rpc_url: "https://rpc.ankr.com/polygon_mumbai",
    blockchain: "polygon_mumbai",
    currency: "MATIC",
    explorer: "https://mumbai.polygonscan.com",
  },
  42161: {
    name: "Arbitrum One",
    blockchain: "arbitrum",
    chain_id: 42161,
    rpc_url: "https://rpc.ankr.com/arbitrum",
    currency: "ETH",
    explorer: "https://arbiscan.io",
  },
  56: {
    name: "BNB Smart Chain",
    blockchain: "bsc",
    chain_id: 56,
    rpc_url: "https://rpc.ankr.com/bsc",
    currency: "BNB",
    explorer: "https://bscscan.com",
  },
  97: {
    name: "BNB Smart Chain Testnet",
    blockchain: "bsc_testnet_chapel",
    chain_id: 97,
    rpc_url: "https://rpc.ankr.com/bsc_testnet_chapel",
    currency: "tBNB",
    explorer: "https://testnet.bscscan.com",
  },
  204: {
    name: "opBNB Mainnet",
    chain_id: 204,
    blockchain: "opbnb",
    rpc_url: "https://opbnb.publicnode.com",
    currency: "BNB",
    explorer: "https://opbnbscan.com/",
  },
};

export const testnetChains = [80001, 97];

export const testnetChainFaucets = {
  97: "https://testnet.binance.org/faucet-smart",
  80001: "https://mumbaifaucet.com",
};

export const gaslessChains = [137];

export enum ChainNames {
  "eth" = "Ethereum",
  "polygon" = "Polygon PoS",
  "polygon_mumbai" = "Polygon Mumbai",
  "arbitrum" = "Arbitrum One",
  "bsc" = "BNB Smart Chain",
  "bsc_testnet_chapel" = "BNB Smart Chain Testnet",
  "opbnb" = "opBNB Mainnet",
}

export enum ChainIds {
  "eth" = 1,
  "polygon" = 137,
  "polygon_mumbai" = 80001,
  "arbitrum" = 42161,
  "bsc" = 56,
  "bsc_testnet_chapel" = 97,
  "opbnb" = 204,
}

export default chains;
