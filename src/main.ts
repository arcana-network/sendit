import { createApp } from "vue";
import { Buffer } from "buffer";
import {createPinia} from "pinia";

import "./style.css";
import App from "./App.vue";

window.Buffer = Buffer
createApp(App).use(createPinia()).mount("#app");
