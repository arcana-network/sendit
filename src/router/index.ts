import { createWebHistory, createRouter, RouteRecordRaw } from "vue-router";
import Waitlist from "@/pages/waitlist.vue";
import Invite from "@/pages/invite.vue";
import App from "@/pages/app.vue";

const routes: RouteRecordRaw[] = [
  {
    name: "Waitlist",
    path: "/",
    component: Waitlist,
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
        children: [
          {
            name: "Send",
            path: "transaction/send",
            component: () =>
              import("@/pages/private/transaction/send/index.vue"),
          },
          {
            name: "History",
            path: "transaction/history",
            component: () =>
              import("@/pages/private/transaction/history/index.vue"),
          },
          {
            name: "Leaderboard",
            path: "transaction/leaderboard",
            component: () => import("@/pages/private/leaderboard/index.vue"),
          },
          {
            name: "Rewards",
            path: "rewards",
            component: () => import("@/pages/private/rewards/index.vue"),
            redirect: { name: "My Rewards" },
            children: [
              {
                name: "My Rewards",
                path: "my-rewards",
                component: () =>
                  import("@/pages/private/rewards/my-rewards/index.vue"),
              },
              {
                name: "Redeem XP",
                path: "redeem",
                component: () =>
                  import("@/pages/private/rewards/redeem/index.vue"),
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
