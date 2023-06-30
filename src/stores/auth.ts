import { defineStore } from "pinia";

const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    isSocketLoggedIn: false,
    userInfo: {},
  }),
  getters: {
    walletAddress(state) {
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
  },
});

export default useAuthStore;
