import { AuthProvider } from "@arcana/auth";

const ARCANA_APP_ADDRESS = import.meta.env.VITE_ARCANA_APP_ADDRESS;

let authInstance: typeof AuthProvider;

function useArcanaAuth() {
  async function init() {
    if (!authInstance) {
      authInstance = new AuthProvider(ARCANA_APP_ADDRESS);
      await authInstance.init();
    }
  }

  async function connect() {
    try {
      const provider = await authInstance.connect();
      console.log({ provider });
    } catch (error) {
      console.log({ error });
    }
  }

  async function isLoggedIn() {
    return await authInstance.isLoggedIn();
  }

  async function loginWithSocial(type: string) {
    if (!(await isLoggedIn())) {
      return await authInstance.loginWithSocial(type);
    }
  }

  async function loginWithLink(email: string) {
    if (!(await isLoggedIn())) {
      await authInstance.loginWithLink(email);
    }
  }

  async function fetchUserDetails() {
    return authInstance.getUser();
  }

  async function logout() {
    await authInstance.logout();
  }

  async function getPublicKey(email: string) {
    return await authInstance.getPublicKey(email);
  }

  function getProvider() {
    return authInstance.provider;
  }

  return {
    connect,
    init,
    isLoggedIn,
    loginWithSocial,
    loginWithLink,
    logout,
    fetchUserDetails,
    getPublicKey,
    getProvider,
  };
}

export default useArcanaAuth;
