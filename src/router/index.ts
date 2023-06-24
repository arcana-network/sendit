import { createWebHistory, createRouter } from "vue-router";

import Login from "../pages/login.vue";
import Private from "../pages/private/index.vue";
import Send from "../pages/private/transaction/send/index.vue";

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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export { router };
