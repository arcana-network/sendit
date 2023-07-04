import { createWebHistory, createRouter } from "vue-router";

import Login from "@/pages/login.vue";
import Private from "@/pages/private/index.vue";
import Send from "@/pages/private/transaction/send/index.vue";
import Rewards from "@/pages/private/rewards/index.vue";
import Leaderboard from "@/pages/private/leaderboard/index.vue";
import History from "@/pages/private/transaction/history/index.vue";
import MyRewards from "@/pages/private/rewards/my-rewards/index.vue";
import RedeemXP from "@/pages/private/rewards/redeem/index.vue";
import EarnXP from "@/pages/private/rewards/earn/index.vue";

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
        name: "History",
        path: "transactions",
        component: History,
      },
      {
        name: "Leaderboard",
        path: "leaderboard",
        component: Leaderboard,
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
            component: MyRewards,
          },
          {
            name: "Redeem XP",
            path: "redeem",
            component: RedeemXP,
          },
          {
            name: "Earn XP",
            path: "earn",
            component: EarnXP,
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
