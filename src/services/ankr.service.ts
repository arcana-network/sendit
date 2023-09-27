import axios from "axios";
import Decimal from "decimal.js";

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
    axios.post("https://rpc.ankr.com/bsc", payload),
    axios.post("https://rpc.ankr.com/bsc_testnet_chapel", payload),
  ];
  const [eth, polygon, polygon_mumbai, arbitrum, bsc, bsc_testnet_chapel] =
    await Promise.all(ankrPromises);
  return [
    {
      tokenType: "NATIVE",
      tokenSymbol: "ETH",
      blockchain: "eth",
      balance: new Decimal(eth.data.result)
        .mul(Decimal.pow(10, -18))
        .toString(),
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "MATIC",
      blockchain: "polygon",
      balance: new Decimal(polygon.data.result)
        .mul(Decimal.pow(10, -18))
        .toString(),
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "MATIC",
      blockchain: "polygon_mumbai",
      balance: new Decimal(polygon_mumbai.data.result)
        .mul(Decimal.pow(10, -18))
        .toString(),
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "ETH",
      blockchain: "arbitrum",
      balance: new Decimal(arbitrum.data.result)
        .mul(Decimal.pow(10, -18))
        .toString(),
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "BNB",
      blockchain: "bsc",
      balance: new Decimal(bsc.data.result)
        .mul(Decimal.pow(10, -18))
        .toString(),
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "tBNB",
      blockchain: "bsc_testnet_chapel",
      balance: new Decimal(bsc_testnet_chapel.data.result)
        .mul(Decimal.pow(10, -18))
        .toString(),
    },
  ];
}

export { getAccountBalance, fetchRewards, getNativeTokenBalances };
