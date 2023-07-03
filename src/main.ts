import { createApp } from "vue";
import { createPinia } from "pinia";
import { Buffer } from "buffer";
import Toast from "vue-toastification";

import "vue-toastification/dist/index.css";

import "./style.css";
import App from "./App.vue";
import { router } from "./router";

window.Buffer = Buffer;

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(Toast);
app.mount("#app");
