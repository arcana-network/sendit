import axios from "axios";

const URL = import.meta.env.VITE_ANKR_PREMIUM_URL;
const FETCH_TOKENS_AFTER = import.meta.env.VITE_FETCH_TOKENS_AFTER || "0";
const VITE_REWARDS_CONTRACT_ADDRESS = import.meta.env
  .VITE_REWARDS_CONTRACT_ADDRESS;

const ANKR_SERVICE = axios.create({
  baseURL: URL,
});

let publicRpcId = 0;

async function getAccountBalance(walletAddress: string, blockchain: string[]) {
  const payload = {
    jsonrpc: "2.0",
    method: "ankr_getAccountBalance",
    params: {
      walletAddress,
      blockchain,
      nativeFirst: true,
      onlyWhitelisted: true,
      pageSize: 50,
      pageToken: null,
    },
    id: 1,
  };
  return (await ANKR_SERVICE.post("?ankr_getAccountBalance=", payload)).data;
}

async function fetchRewards(walletAddress: string) {
  const payload = {
    jsonrpc: "2.0",
    method: "ankr_getNFTsByOwner",
    params: {
      blockchain: ["polygon"],
      walletAddress,
      pageSize: 50,
      pageToken: null,
    },
    id: 1,
  };
  try {
    const { data } = await ANKR_SERVICE.post("?ankr_getNFTsByOwner=", payload);
    if (
      data?.result?.assets instanceof Array &&
      data.result.assets.length > 0
    ) {
      return data.result.assets.filter(
        (asset) =>
          asset.contractAddress === VITE_REWARDS_CONTRACT_ADDRESS &&
          Number(asset.tokenId) > Number(FETCH_TOKENS_AFTER)
      );
    }
    return [];
  } catch (e) {
    throw e;
  }
}

async function getNativeTokenBalances(walletAddress: string) {
  const payload = {
    method: "eth_getBalance",
    params: [walletAddress, "latest"],
    id: publicRpcId++,
    jsonrpc: "2.0",
  };
  const ankrPromises = [
    axios.post("https://rpc.ankr.com/eth", payload),
    axios.post("https://rpc.ankr.com/polygon", payload),
    axios.post("https://rpc.ankr.com/polygon_mumbai", payload),
    axios.post("https://rpc.ankr.com/arbitrum", payload),
  ];
  const [eth, polygon, polygon_mumbai, arbitrum] = await Promise.all(
    ankrPromises
  );
  return [
    {
      tokenType: "NATIVE",
      tokenSymbol: "ETH",
      blockchain: "eth",
      balance: Number(eth.data.result),
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "MATIC",
      blockchain: "polygon",
      balance: Number(polygon.data.result),
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "MATIC",
      blockchain: "polygon_mumbai",
      balance: Number(polygon_mumbai.data.result),
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "ETH",
      blockchain: "arbitrum",
      balance: Number(arbitrum.data.result),
    },
  ];
}

export { getAccountBalance, fetchRewards, getNativeTokenBalances };
