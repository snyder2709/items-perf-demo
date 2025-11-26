import { ROUTES } from "@/shared/constants/routes";

export const itemsPerfRoutes = [
  {
    path: ROUTES.ITEMS_PERF.path,
    name: ROUTES.ITEMS_PERF.name,
    meta: {
      title: ROUTES.ITEMS_PERF.title,
    },
    component: () => import("./page/ItemsPerfPage.vue"),
  },
];
