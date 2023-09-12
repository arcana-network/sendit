import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";
import Invite from "@/pages/invite.vue";
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
    component: Invite,
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
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: { name: "Waitlist" },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { router };
