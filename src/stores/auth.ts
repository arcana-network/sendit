import { defineStore } from "pinia";

type AuthStore = {
  isLoggedIn: boolean;
  userInfo: Record<string, any>;
  isAuthSDKInitialized: boolean;
  loggedInWith: "" | "metamask" | "walletconnect";
  provider: any | null;
};

const useAuthStore = defineStore("auth", {
  state: () =>
    ({
      isLoggedIn: false,
      userInfo: {},
      isAuthSDKInitialized: false,
      loggedInWith: "",
      provider: null,
    } as AuthStore),
  getters: {
    walletAddress(state) {
      // @ts-ignore
      return state.userInfo.address;
    },
  },
  actions: {
    setLoginStatus(status: boolean): void {
      this.isLoggedIn = status;
    },
    setUserInfo(info: object): void {
      this.userInfo = info;
    },
    setAuthInitialized(status: boolean): void {
      this.isAuthSDKInitialized = status;
    },
  },
});

export default useAuthStore;
