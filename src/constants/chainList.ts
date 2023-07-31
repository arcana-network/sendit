const chains = {
  1: {
    name: "Ethereum",
    chain_id: 1,
    rpc_url: "https://rpc.builder0x69.io",
    blockchain: "eth",
    currency: "ETH",
  },
  137: {
    name: "Polygon",
    chain_id: 137,
    rpc_url: "https://polygon-bor.publicnode.com",
    blockchain: "polygon",
    currency: "MATIC",
  },
  80001: {
    name: "Polygon Mumbai",
    chain_id: 80001,
    rpc_url: "https://rpc-mumbai.maticvigil.com",
    blockchain: "polygon_mumbai",
    currency: "MATIC",
  },
  42161: {
    name: "Arbitrum One",
    blockchain: "arbitrum",
    chain_id: 42161,
    rpc_url: "https://arb1.arbitrum.io/rpc",
    currency: "ETH",
  },
};

export default chains;
