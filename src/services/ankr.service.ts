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
  const payload = {
    method: "eth_getBalance",
    params: [walletAddress, "latest"],
    id: publicRpcId++,
    jsonrpc: "2.0",
  };
  const ankrPromises = [
    axios.post(chains[1].rpc_url, payload),
    axios.post(chains[137].rpc_url, payload),
    axios.post(chains[80002].rpc_url, payload),
    axios.post(chains[42161].rpc_url, payload),
    axios.post(chains[56].rpc_url, payload),
    axios.post(chains[97].rpc_url, payload),
    axios.post(chains[204].rpc_url, payload),
    axios.post(chains[59144].rpc_url, payload),
    axios.post(chains[59140].rpc_url, payload),
  ];
  const [
    eth,
    polygon,
    polygon_amoy,
    arbitrum,
    bsc,
    bsc_testnet_chapel,
    opbnb_mainnet,
    linea,
    linea_goerli,
  ] = await Promise.allSettled(ankrPromises);
  return [
    {
      tokenType: "NATIVE",
      tokenSymbol: "ETH",
      blockchain: "eth",
      balance:
        eth.status === "fulfilled" && eth.value.data.result
          ? new Decimal(eth.value.data.result)
              .mul(Decimal.pow(10, -18))
              .toString()
          : 0,
      thumbnail: "https://ethereum.org/assets/svgs/eth-glyph-colored.svg",
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "MATIC",
      blockchain: "polygon",
      balance:
        polygon.status === "fulfilled" && polygon.value.data.result
          ? new Decimal(polygon.value.data.result)
              .mul(Decimal.pow(10, -18))
              .toString()
          : 0,
      thumbnail: "https://ankrscan.io/assets/blockchains/polygon.svg",
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "MATIC",
      blockchain: "polygon_amoy",
      balance:
        polygon_amoy.status === "fulfilled" && polygon_amoy.value.data.result
          ? new Decimal(polygon_amoy.value.data.result)
              .mul(Decimal.pow(10, -18))
              .toString()
          : 0,
      thumbnail: "https://ankrscan.io/assets/blockchains/polygon.svg",
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "ETH",
      blockchain: "arbitrum",
      balance:
        arbitrum.status === "fulfilled" && arbitrum.value.data.result
          ? new Decimal(arbitrum.value.data.result)
              .mul(Decimal.pow(10, -18))
              .toString()
          : 0,
      thumbnail: "https://ankrscan.io/assets/blockchains/arbitrum.svg",
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "BNB",
      blockchain: "bsc",
      balance:
        bsc.status === "fulfilled" && bsc.value.data.result
          ? new Decimal(bsc.value.data.result)
              .mul(Decimal.pow(10, -18))
              .toString()
          : 0,
      thumbnail: "https://ankrscan.io/assets/blockchains/binance.svg",
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "BNB",
      blockchain: "bsc_testnet_chapel",
      balance:
        bsc_testnet_chapel.status === "fulfilled" &&
        bsc_testnet_chapel.value.data.result
          ? new Decimal(bsc_testnet_chapel.value.data.result)
              .mul(Decimal.pow(10, -18))
              .toString()
          : 0,
      thumbnail: "https://ankrscan.io/assets/blockchains/binance.svg",
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "BNB",
      blockchain: "opbnb",
      balance:
        opbnb_mainnet.status === "fulfilled" && opbnb_mainnet.value.data.result
          ? new Decimal(opbnb_mainnet.value.data.result)
              .mul(Decimal.pow(10, -18))
              .toString()
          : 0,
      thumbnail: "https://ankrscan.io/assets/blockchains/binance.svg",
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "ETH",
      blockchain: "linea",
      balance:
        linea.status === "fulfilled" && linea.value.data.result
          ? new Decimal(linea.value.data.result)
              .mul(Decimal.pow(10, -18))
              .toString()
          : 0,
      thumbnail: chains[59144].icon_url,
    },
    {
      tokenType: "NATIVE",
      tokenSymbol: "ETH",
      blockchain: "linea_testnet",
      balance:
        linea_goerli.status === "fulfilled" && linea_goerli.value.data.result
          ? new Decimal(linea_goerli.value.data.result)
              .mul(Decimal.pow(10, -18))
              .toString()
          : 0,
      thumbnail: chains[59140].icon_url,
    },
  ];
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
