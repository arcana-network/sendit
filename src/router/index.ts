import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";
import App from "@/pages/app.vue";
import Landing from "@/pages/landing.vue";

const routes: RouteRecordRaw[] = [
  {
    name: "Landing",
    path: "/",
    component: Landing,
  },
  {
    name: "Invite",
    path: "/invite",
    component: () => import("@/pages/invite.vue"),
  },
  {
    name: "Payment Request",
    path: "/payment-request",
    component: () => import("@/pages/payment-request.vue"),
  },
  {
    name: "App",
    path: "/app",
    component: App,
    redirect: { name: "Send" },
    children: [
      {
        path: "login",
        component: () => import("@/pages/login.vue"),
        name: "Login",
      },
      {
        path: "",
        component: () => import("@/pages/private/index.vue"),
        name: "Private",
        redirect: { name: "Send" },
        children: [
          {
            name: "Send",
            path: "transaction/send",
            component: () =>
              import("@/pages/private/transaction/send/index.vue"),
          },
          {
            name: "Request",
            path: "transaction/request",
            component: () =>
              import("@/pages/private/transaction/request/index.vue"),
          },
          {
            name: "Wallets",
            path: "wallets",
            component: () => import("@/pages/private/wallets/index.vue"),
          },
          {
            name: "History",
            path: "transaction/history",
            component: () =>
              import("@/pages/private/transaction/history/index.vue"),
          },
          {
            name: "Leaderboard",
            path: "leaderboard",
            component: () => import("@/pages/private/leaderboard/index.vue"),
          },
          {
            name: "Rewards",
            path: "rewards",
            component: () => import("@/pages/private/rewards/index.vue"),
            redirect: { name: "Earn XP" },
            children: [
              {
                name: "My Rewards",
                path: "owned",
                component: () =>
                  import("@/pages/private/rewards/my-rewards/index.vue"),
              },
              {
                name: "Earn XP",
                path: "earn",
                component: () =>
                  import("@/pages/private/rewards/earn/index.vue"),
              },
              {
                name: "Airdrop",
                path: "airdrop",
                component: () =>
                  import("@/pages/private/rewards/airdrop/index.vue"),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Twitter Redirect",
    path: "/twitter-redirect",
    component: () => import("@/pages/twitter-redirect.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { router };
