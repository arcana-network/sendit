import { defineStore } from "pinia";

const useLoaderStore = defineStore("loader", {
  state: () => ({
    show: false,
    message: "",
  }),
  actions: {
    showLoader(message: string): void {
      this.show = true;
      this.message = message;
    },
    hideLoader(): void {
      this.show = false;
      this.message = "";
    },
  },
});

export default useLoaderStore;
