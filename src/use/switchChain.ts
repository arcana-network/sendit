import { Decimal } from "decimal.js";
import useAuthStore from "@/stores/auth";
import chains from "@/constants/chainList";

export async function switchChain(chainId) {
  const authStore = useAuthStore();
  try {
    await authStore.provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: new Decimal(chainId).ceil().toHexadecimal() }],
    });
  } catch (e: any) {
    if (e.code === 4902) {
      const chainDetails = chains[Number(chainId)];
      try {
        if (!chainDetails) throw e;
        await authStore.provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: new Decimal(chainId).ceil().toHexadecimal(),
              chainName: chainDetails.name,
              nativeCurrency: {
                symbol: chainDetails.currency,
                decimals: 18,
              },
              rpcUrls: [chainDetails.rpc_url],
              blockExplorerUrls: [chainDetails.explorer],
            },
          ],
        });
        const walletChainId = await authStore.provider.request({
          method: "eth_chainId",
        });
        if (Number(walletChainId) !== Number(chainId)) {
          await authStore.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: new Decimal(chainId).ceil().toHexadecimal() }],
          });
        }
      } catch (e) {
        throw e;
      }
    } else throw e;
  }
}
