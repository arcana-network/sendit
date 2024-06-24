const chains = {
  1: {
    name: "Ethereum",
    chain_id: 1,
    rpc_url:
      "https://eth-mainnet.blastapi.io/7c12fa10-4e46-4810-bf66-6b3148119501",
    blockchain: "eth",
    currency: "ETH",
    explorer: "https://etherscan.io",
    icon_url: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
  },
  137: {
    name: "Polygon",
    chain_id: 137,
    rpc_url:
      "https://polygon-mainnet.blastapi.io/7c12fa10-4e46-4810-bf66-6b3148119501",
    blockchain: "polygon",
    currency: "MATIC",
    explorer: "https://polygonscan.com",
    icon_url: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
  },
  80001: {
    name: "Polygon Mumbai Testnet",
    chain_id: 80001,
    rpc_url: "/",
    blockchain: "polygon_mumbai",
    currency: "MATIC",
    explorer: "https://mumbai.polygonscan.com",
    icon_url: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
  },
  80002: {
    name: "Polygon Amoy Testnet",
    chain_id: 80002,
    rpc_url: "https://rpc-amoy.polygon.technology",
    blockchain: "polygon_amoy",
    currency: "MATIC",
    explorer: "https://amoy.polygonscan.com",
    icon_url: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
  },
  42161: {
    name: "Arbitrum One",
    blockchain: "arbitrum",
    chain_id: 42161,
    rpc_url:
      "https://arbitrum-one.blastapi.io/7c12fa10-4e46-4810-bf66-6b3148119501",
    currency: "ETH",
    explorer: "https://arbiscan.io",
    icon_url: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg",
  },
  56: {
    name: "BNB Smart Chain",
    blockchain: "bsc",
    chain_id: 56,
    rpc_url:
      "https://bsc-mainnet.blastapi.io/7c12fa10-4e46-4810-bf66-6b3148119501",
    currency: "BNB",
    explorer: "https://bscscan.com",
    icon_url: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
  },
  97: {
    name: "BNB Smart Chain Testnet",
    blockchain: "bsc_testnet_chapel",
    chain_id: 97,
    rpc_url:
      "https://bsc-testnet.blastapi.io/7c12fa10-4e46-4810-bf66-6b3148119501",
    currency: "BNB",
    explorer: "https://testnet.bscscan.com",
    icon_url: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
  },
  204: {
    name: "opBNB Mainnet",
    chain_id: 204,
    blockchain: "opbnb",
    rpc_url: "https://opbnb-rpc.publicnode.com",
    currency: "BNB",
    explorer: "https://opbnbscan.com/",
    icon_url: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
  },
  59144: {
    name: "Linea",
    chain_id: 59144,
    rpc_url:
      "https://linea-mainnet.blastapi.io/7c12fa10-4e46-4810-bf66-6b3148119501",
    blockchain: "linea",
    currency: "ETH",
    explorer: "https://lineascan.build",
    icon_url: "https://icons.llamao.fi/icons/chains/rsz_linea.jpg",
  },
  59140: {
    name: "Linea Goerli",
    chain_id: 59140,
    rpc_url:
      "https://linea-goerli.blastapi.io/7c12fa10-4e46-4810-bf66-6b3148119501",
    blockchain: "linea_testnet",
    currency: "ETH",
    explorer: "https://goerli.lineascan.build",
    icon_url: "https://icons.llamao.fi/icons/chains/rsz_linea.jpg",
  },
  421614: {
    name: "Arbitrum Sepolia",
    chain_id: 421614,
    rpc_url:
      "https://rpc.ankr.com/arbitrum_sepolia/7c12fa10-4e46-4810-bf66-6b3148119501",
    blockchain: "arbitrum_sepolia",
    currency: "ETH",
    explorer: "https://sepolia.arbiscan.io",
    icon_url: "https://icons.llamao.fi/icons/chains/rsz_linea.jpg",
  },
};

export const testnetChains = [80002, 97, 421614];

export const testnetChainFaucets = {
  97: "https://testnet.binance.org/faucet-smart",
  80002: "https://faucet.polygon.technology",
  421614: "https://www.alchemy.com/faucets/arbitrum-sepolia",
};

export enum ChainNames {
  "eth" = "Ethereum",
  "polygon" = "Polygon PoS",
  "polygon_amoy" = "Polygon Amoy Testnet",
  "arbitrum" = "Arbitrum One",
  "bsc" = "BNB Smart Chain",
  "bsc_testnet_chapel" = "BNB Smart Chain Testnet",
  "opbnb" = "opBNB Mainnet",
  "linea" = "Linea",
  "linea_testnet" = "Linea Goerli",
  "polygon_mumbai" = "Polygon Mumbai Testnet",
  "arbitrum_sepolia" = "Arbitrum Sepolia",
}

export enum ChainIds {
  "eth" = 1,
  "polygon" = 137,
  "polygon_amoy" = 80002,
  "arbitrum" = 42161,
  "bsc" = 56,
  "bsc_testnet_chapel" = 97,
  "opbnb" = 204,
  "linea" = 59144,
  "linea_testnet" = 59140,
  "polygon_mumbai" = 80001,
  "arbitrum_sepolia" = 421614,
}

export const SupportedChainIdsForAccounts = {
  eoa: [1, 137, 80002, 42161, 56, 97, 204, 421614],
  scw: [137, 421614],
};

export const gaslessChains = [137, 421614];

export default chains;
