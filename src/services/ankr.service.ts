import chains from "@/constants/chainList";
import axios from "axios";
import Decimal from "decimal.js";

const URL = import.meta.env.VITE_ANKR_PREMIUM_URL;
const FETCH_TOKENS_AFTER = import.meta.env.VITE_FETCH_TOKENS_AFTER || "0";
const VITE_REWARDS_CONTRACT_ADDRESS = import.meta.env
  .VITE_REWARDS_CONTRACT_ADDRESS;

const ANKR_SERVICE = axios.create({
  baseURL: URL,
});

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
      forceFetch: true,
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
  return Promise.all([
    {
      tokenType: "NATIVE",
      tokenSymbol: "ETH",
      blockchain: "eth",
      chainID: 1,
      thumbnail: "https://ethereum.org/assets/svgs/eth-glyph-colored.svg",
      balance: 0,
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "MATIC",
      blockchain: "polygon",
      chainID: 137,
      thumbnail: "https://ankrscan.io/assets/blockchains/polygon.svg",
      balance: 0,
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "MATIC",
      blockchain: "polygon_amoy",
      chainID: 80002,
      thumbnail: "https://ankrscan.io/assets/blockchains/polygon.svg",
      balance: 0,
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "ETH",
      blockchain: "arbitrum",
      chainID: 42161,
      thumbnail: "https://ankrscan.io/assets/blockchains/arbitrum.svg",
      balance: 0,
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "BNB",
      blockchain: "bsc",
      chainID: 56,
      thumbnail: "https://ankrscan.io/assets/blockchains/binance.svg",
      balance: 0,
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "BNB",
      blockchain: "bsc_testnet_chapel",
      chainID: 97,
      thumbnail: "https://ankrscan.io/assets/blockchains/binance.svg",
      balance: 0,
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "BNB",
      blockchain: "opbnb",
      chainID: 204,
      thumbnail: "https://ankrscan.io/assets/blockchains/binance.svg",
      balance: 0,
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "ETH",
      blockchain: "linea",
      chainID: 59144,
      thumbnail: chains[59144].icon_url,
      balance: 0,
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "ETH",
      blockchain: "linea_testnet",
      chainID: 59140,
      thumbnail: chains[59140].icon_url,
      balance: 0,
    },
  ].map(async (entry: {
    tokenType: string,
    tokenSymbol: string,
    blockchain: string,
    chainID: number,
    thumbnail: string,
    balance: string | number,
  }) => {
    const payload = {
      method: "eth_getBalance",
      params: [walletAddress, "latest"],
      id: 1,
      jsonrpc: "2.0",
    };
    try {
      const resp = await axios.post(chains[entry.chainID].rpc_url, payload)
      if (resp.data.result) {
        entry.balance = new Decimal(resp.data.result)
            .mul(Decimal.pow(10, -18))
            .toString()
      }
    } catch (e) {
      console.error('Caught error while fetching balance:', e, entry)
    }
    return entry
  }))
}

async function fetchAllTokenBalances(walletAddress: string) {
  let nativeAssets = [] as any[];
  const nativeData = await getNativeTokenBalances(walletAddress);
  if (nativeData?.length) {
    nativeAssets = nativeData?.map((asset) => {
      const address = "NATIVE";
      return {
        ...asset,
        contractAddress: address,
        name: `${asset.tokenSymbol || "Unknown"}-${asset.tokenType}`,
      };
    });
  }
  const data = await getAccountBalance(walletAddress, [
    "eth",
    "polygon",
    "arbitrum",
    "bsc",
  ]);
  let erc20Assets = [] as any[];
  if (data?.result?.assets?.length) {
    erc20Assets = data?.result?.assets
      .map((asset) => {
        const address =
          asset.tokenType === "NATIVE" ? "NATIVE" : asset.contractAddress;
        return {
          ...asset,
          contractAddress: address,
          name: `${asset.tokenSymbol || "Unknown"}-${asset.tokenType}`,
        };
      })
      .filter((asset) => asset.tokenType !== "NATIVE");
  }
  return [...erc20Assets, ...nativeAssets];
}

async function getBicoBalance(walletAddress) {
  const BicoContract = "0xF17e65822b568B3903685a7c9F496CF7656Cc6C2";
  const payload = {
    jsonrpc: "2.0",
    method: "eth_call",
    params: [
      {
        to: BicoContract,
        data: `0x70a08231000000000000000000000000${walletAddress.slice(2)}`,
      },
      "latest",
    ],
    id: 1,
  };
  const { data } = await axios.post(chains[1].rpc_url, payload);
  return data.result;
}

export {
  getAccountBalance,
  fetchRewards,
  getNativeTokenBalances,
  fetchAllTokenBalances,
  getBicoBalance,
};
