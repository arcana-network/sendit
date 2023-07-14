import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/html";
import { configureChains, createConfig, getAccount } from "@wagmi/core";
import { arbitrum, mainnet, polygon } from "@wagmi/core/chains";

function useWalletConnect() {
  const chains = [arbitrum, mainnet, polygon];
  const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

  const { publicClient } = configureChains(chains, [
    w3mProvider({ projectId }),
  ]);
  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: w3mConnectors({ projectId, chains }),
    publicClient,
  });
  const ethereumClient = new EthereumClient(wagmiConfig, chains);
  const web3modal = new Web3Modal({ projectId }, ethereumClient);

  function disconnect() {
    ethereumClient.disconnect();
  }

  return {
    getAccount,
    web3modal,
    disconnect,
  };
}

export default useWalletConnect;
