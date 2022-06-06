import Vue from "vue";
import VueRouter from "vue-router";
import { defaultLocale } from "../services/locale.service.js";
import { redirect, createRoutes } from "./extensions.js";
import store from "@/store/index";
Vue.use(VueRouter);

const routes = [
  redirect("/", `/${defaultLocale}`),
  redirect("*", "Home"),
  ...createRoutes("/:locale"),
];
// console.log(...routes);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition;
    if (to.name == from.name) return {};
    if (to.hash) return { selector: to.hash };
    return { x: 0, y: 0 };
  },
});
store;
router.beforeEach((to, from, next) => {
  if (Object.keys(to.meta).length === 0) return next(); //TODO fix children
  const redirect = to.meta.redirect.includes("/")
    ? { path: "/" + to.params.locale + to.meta.redirect }
    : { name: to.meta.redirect };
  if (!to.meta.allowedOrigins.includes("ALL"))
    if (
      !to.meta.allowedOrigins.includes(from.name) &&
      !to.meta.allowedOrigins.includes(from.path)
    )
      return next(redirect);
  if (to.meta.allowedRoles.includes("ALL")) return next();
  if (store.getters["auth/roles"] != null)
    for (const role of store.getters["auth/roles"])
      if (to.meta.allowedRoles.includes(role)) return next();
  return next(redirect);
});

export default router;

