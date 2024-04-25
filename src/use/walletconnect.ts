import { createWeb3Modal, defaultWagmiConfig } from "@web3modal/wagmi/vue";
import { getAccount, disconnect } from "@wagmi/core";
import {
  mainnet,
  polygon,
  sepolia,
  arbitrum,
  bsc,
  bscTestnet,
} from "viem/chains";

function useWalletConnect() {
  const chains = [mainnet, polygon, sepolia, arbitrum, bsc, bscTestnet];
  const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
  const featuredWallets = {
    okx: "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
  };

  const metadata = {
    name: "SendIt",
    description: "Send crypto with email.",
    url: "https://sendit.arcana.network",
    icons: ["https://sendit.arcana.network/send-it.svg"],
  };

  const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });
  const web3modal = createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    themeMode: "light",
    featuredWalletIds: [featuredWallets.okx],
  });

  return {
    getAccount,
    web3modal,
    disconnect,
  };
}

export default useWalletConnect;
