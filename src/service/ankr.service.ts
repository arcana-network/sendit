import axios from "axios";

const URL = import.meta.env.VITE_ANKR_PREMIUM_API_URL;

const ANKR_SERVICE = axios.create({
  baseURL: URL,
});

async function getAccountBalance(walletAddress: string, blockchain: string) {
  const payload = {
    jsonrpc: "2.0",
    method: "ankr_getAccountBalance",
    params: { walletAddress, blockchain },
    id: 1,
  };
  return (await ANKR_SERVICE.post("?ankr_getAccountBalance=", payload)).data;
}

export { getAccountBalance };
