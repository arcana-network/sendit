import { AuthProvider } from "@arcana/auth";

const ARCANA_APP_ADDRESS = import.meta.env.VITE_ARCANA_APP_ADDRESS;

let authInstance: AuthProvider;

function useArcanaAuth() {
  async function init() {
    if (!authInstance) {
      authInstance = new AuthProvider(ARCANA_APP_ADDRESS);
      await authInstance.init();
    }
  }

  async function connect() {
    try {
      await authInstance.connect();
    } catch (error) {
      console.log({ error });
    }
  }

  function getProvider() {
    return authInstance.provider;
  }

  function getAuthInstance() {
    return authInstance;
  }

  async function isLoggedIn() {
    return await authInstance.isLoggedIn();
  }

  async function switchChain(chainId: string) {
    await getProvider().request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId,
        },
      ],
    });
  }

  return {
    connect,
    init,
    getProvider,
    isLoggedIn,
    getAuthInstance,
    switchChain,
  };
}

export default useArcanaAuth;
