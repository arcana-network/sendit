import { defineStore } from "pinia";

const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
    isSocketLoggedIn: false,
  }),
  actions: {
    setLoginStatus(status: boolean): void {
      this.isLoggedIn = status;
    },
    setSocketLoginStatus(status: boolean): void {
      this.isSocketLoggedIn = status;
    },
  },
});

export default useAuthStore;
