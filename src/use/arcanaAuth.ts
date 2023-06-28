import { AuthProvider } from "@arcana/auth";

const ARCANA_APP_ADDRESS = import.meta.env.VITE_ARCANA_APP_ADDRESS;

let authInstance: AuthProvider;

function useArcanaAuth() {
  async function init() {
    if (!authInstance) {
      authInstance = new AuthProvider(ARCANA_APP_ADDRESS, {
        theme: "light",
      });
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

  async function isLoggedIn() {
    return await authInstance.isLoggedIn();
  }

  async function getUser() {
    return await authInstance.getUser();
  }

  return {
    connect,
    init,
    getProvider,
    isLoggedIn,
    getUser,
  };
}

export default useArcanaAuth;
