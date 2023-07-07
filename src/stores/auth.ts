import { defineStore } from "pinia";

const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    isSocketLoggedIn: false,
    userInfo: {} as any,
    isAuthSDKInitialized: false,
  }),
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
