import { createApp } from "vue";
import { createPinia } from "pinia";
import { Buffer } from "buffer";
import Toast from "vue-toastification";

import "vue-toastification/dist/index.css";

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

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(Toast, toastOptions);
app.mount("#app");
