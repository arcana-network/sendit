import { createWebHistory, createRouter } from "vue-router";

import Login from "../pages/login.vue";
import Private from "../pages/private/index.vue";
import Send from "../pages/private/transaction/send/index.vue";
import Rewards from "../pages/private/rewards/index.vue";

const routes = [
  { path: "/login", component: Login, name: "Login" },
  {
    path: "/",
    component: Private,
    name: "Private",
    children: [
      {
        name: "Send",
        path: "transaction/send",
        component: Send,
      },
      {
        name: "Rewards",
        path: "rewards",
        component: Rewards,
        redirect: { name: "My Rewards" },
        children: [
          {
            name: "My Rewards",
            path: "",
            component: () =>
              import("../pages/private/rewards/my-rewards/index.vue"),
          },
          {
            name: "Redeem XP",
            path: "redeem",
            component: () =>
              import("../pages/private/rewards/redeem/index.vue"),
          },
          {
            name: "Earn XP",
            path: "earn",
            component: () => import("../pages/private/rewards/earn/index.vue"),
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { router };
