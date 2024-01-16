import { SupportedChainIdsForAccounts } from "@/constants/chainList";
import { ethers } from "ethers";

let currencyCoverage = null as any[] | null;

function getTransakApi() {
  if (import.meta.env.VITE_TRANSAK_ENV === "STAGING") {
    return "https://api-stg.transak.com/api/v2";
  }
  return "https://api.transak.com/api/v2";
}

async function getCurrencyCoverage() {
  if (!currencyCoverage) {
    const options = { method: "GET", headers: { accept: "application/json" } };
    const response = await fetch(
      `${getTransakApi()}/currencies/crypto-currencies`,
      options
    );
    currencyCoverage = (await response.json()).response;
  }
  return currencyCoverage;
}

function getCurrencies(mode: "sell" | "buy", accountType: "eoa" | "scw") {
  return (
    currencyCoverage
      ?.filter(
        (r) =>
          (mode === "sell" ? r.isPayInAllowed : r.isAllowed) &&
          SupportedChainIdsForAccounts[accountType].includes(
            Number(r.network.chainId)
          )
      )
      .map((r) => ({
        chain: r.network.chainId,
        address: r.address === ethers.ZeroAddress ? "NATIVE" : r.address,
        symbol: r.symbol,
        networkName: r.network.name,
      })) || []
  );
}

function generateTransakUrl({
  address,
  email,
  chain,
  token,
  amount,
  mode,
}: {
  address: string;
  email: string;
  chain: string;
  token: string;
  amount: string;
  mode: "sell" | "buy";
}) {
  const Transak =
    import.meta.env.VITE_TRANSAK_ENV === "STAGING"
      ? "https://global-stg.transak.com"
      : "https://global.transak.com";

  const transakUrl = new URL(Transak);
  transakUrl.searchParams.append(
    "apiKey",
    import.meta.env.VITE_TRANSAK_API_KEY
  );
  transakUrl.searchParams.append("walletAddress", address);
  transakUrl.searchParams.append("email", email || "");
  transakUrl.searchParams.append("network", chain);
  transakUrl.searchParams.append("themeColor", "#262626");
  transakUrl.searchParams.append("cryptoCurrencyCode", token);
  transakUrl.searchParams.append("defaultCryptoAmount", amount);
  if (mode === "sell") {
    transakUrl.searchParams.append("productsAvailed", "SELL");
    transakUrl.searchParams.append("walletRedirection", "false");
  } else {
    transakUrl.searchParams.append("productsAvailed", "BUY");
  }
  return transakUrl.toString();
}

export { getCurrencies, getCurrencyCoverage, generateTransakUrl };
