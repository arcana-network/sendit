const FETCH_TOKENS_AFTER = import.meta.env.VITE_FETCH_TOKENS_AFTER || "0";

async function fetchRewards(walletAddress: string) {
  const response = await fetch(
    `${import.meta.env.VITE_ANKR_PREMIUM_URL}/?ankr_getNFTsByOwner`,
    {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "ankr_getNFTsByOwner",
        params: {
          blockchain: ["polygon"],
          walletAddress,
        },
        id: 1,
      }),
    }
  );
  try {
    const data = await response.json();
    if (
      data?.result?.assets instanceof Array &&
      data.result.assets.length > 0
    ) {
      return data.result.assets.filter(
        (asset) =>
          asset.contractAddress ===
            import.meta.env.VITE_REWARDS_CONTRACT_ADDRESS &&
          Number(asset.tokenId) > Number(FETCH_TOKENS_AFTER)
      );
    }
    return [];
  } catch (e) {
    throw e;
  }
}

export { fetchRewards };
