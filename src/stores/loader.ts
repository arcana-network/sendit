import { defineStore } from "pinia";

const useLoaderStore = defineStore("loader", {
  state: () => ({
    show: false,
    message: "",
    submessage: "",
  }),
  actions: {
    showLoader(message: string, submessage?: string): void {
      console.log("showing loader");
      this.show = true;
      this.message = message;
      if (!submessage) {
        this.submessage = "";
      } else {
        this.submessage = submessage;
      }
    },
    hideLoader(): void {
      console.log("hiding loader");
      this.show = false;
      this.message = "";
      this.submessage = "";
    },
  },
});

export default useLoaderStore;
