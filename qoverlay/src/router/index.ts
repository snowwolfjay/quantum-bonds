import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "",
    redirect: "/main",
  },
  {
    path: "/main",
    component: () => import("../views/MainCalcPage.vue"),
  },
  {
    path: "/about",
    component: () => import("../views/AboutPage.vue"),
  },
  {
    path: "/privacy-policy",
    component: () => import("../views/PrivacyPolicyPage.vue"),
  },
  {
    path: "/terms",
    component: () => import("../views/TermsPage.vue"),
  },
  {
    path: "/feedback",
    component: () => import("../views/FeedbackPage.vue"),
  },
  {
    path: "/sponsor",
    component: () => import("../views/SponsorPage.vue"),
  },
  {
    path: "/references",
    component: () => import("../views/ReferencesPage.vue"),
  },
  {
    path: "/glossary",
    component: () => import("../views/GlossaryPage.vue"),
  },
  {
    path: "/persons",
    component: () => import("../views/PersonManagementPage.vue"),
  },
  {
    path:"/:pathMatch(.*)*",
    redirect:"/main"
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
