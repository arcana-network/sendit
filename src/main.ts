import { createApp } from "vue";
import store from "@/stores";
import { Buffer } from "buffer";
import Toast from "vue-toastification";

import "vue-toastification/dist/index.css";
import "@fontsource/caveat/700.css";
import "@fontsource/syne/700.css";

import "@/style.css";
import App from "@/App.vue";
import { router } from "@/router";

window.Buffer = Buffer;

const toastOptions = {
  timeout: 5000,
  closeOnClick: false,
  pauseOnFocusLoss: false,
  pauseOnHover: true,
  draggable: false,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  closeButton: false,
  icon: true,
  rtl: false,
};

const app = createApp(App);

app.use(store);
app.use(router);
app.use(Toast, toastOptions);
app.mount("#app");
