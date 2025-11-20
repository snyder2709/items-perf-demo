import { ROUTES } from "@/shared/constants/routes";

export const mainRoutes = [
  {
    path: ROUTES.MAIN.path,
    name: ROUTES.MAIN.name,
    meta: {
      title: ROUTES.MAIN.title,
    },
    component: () => import("./ui/MainPage.vue"),
  },
];
