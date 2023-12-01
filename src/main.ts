import { createApp } from "vue";
import store from "@/stores";
import { Buffer } from "buffer";
import Toast from "vue-toastification";
import * as Sentry from "@sentry/vue";

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
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ["https://sendit.arcana.network"],
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      }),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

app.use(store);
app.use(router);
app.use(Toast, toastOptions);
app.mount("#app");
