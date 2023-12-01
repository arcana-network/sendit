import { createApp } from "vue";
import store from "@/stores";
import { Buffer } from "buffer";
import Toast from "vue-toastification";
// import * as Sentry from "@sentry/vue";

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

if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  console.log(import.meta.env.PROD, import.meta.env.VITE_SENTRY_DSN);
  // Sentry.init({
  //   app,
  //   dsn: import.meta.env.VITE_SENTRY_DSN,
  //   integrations: [
  //     new Sentry.BrowserTracing({
  //       // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  //       tracePropagationTargets: ["https://sendit.arcana.network"],
  //       routingInstrumentation: Sentry.vueRouterInstrumentation(router),
  //     }),
  //   ],
  //   // Performance Monitoring
  //   tracesSampleRate: 1.0, // Capture 100% of the transactions
  // });
}

app.use(store);
app.use(router);
app.use(Toast, toastOptions);
app.mount("#app");
