import { defineStore } from "pinia";

const useAuthStore = defineStore("auth", {
  state: () => ({
    isLoggedIn: false,
  }),
  actions: {
    setLoginStatus(status: boolean): void {
      this.isLoggedIn = status;
    },
  },
});

export default useAuthStore;
