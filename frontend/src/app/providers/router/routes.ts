import { itemsPerfRoutes } from "@/pages/items-perf";
import { mainRoutes } from "@/pages/main";

export default [
  ...mainRoutes,
  ...itemsPerfRoutes,
  {
    path: "/:pathMatch(.*)*",
    name: "404",
    meta: {
      title: "Error 404",
    },
    component: () => import("@/pages/error/NotFoundPage.vue"),
  },
];
