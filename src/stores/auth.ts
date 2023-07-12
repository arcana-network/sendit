import { defineStore } from "pinia";

type AuthStore = {
  isLoggedIn: boolean;
  isSocketLoggedIn: boolean;
  userInfo: Record<string, any>;
  isAuthSDKInitialized: boolean;
  loggedInWith: "" | "metamask" | "walletconnect";
  provider: any | null;
};

const useAuthStore = defineStore("auth", {
  state: () =>
    ({
      isLoggedIn: false,
      isSocketLoggedIn: false,
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
    setSocketLoginStatus(status: boolean): void {
      this.isSocketLoggedIn = status;
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
