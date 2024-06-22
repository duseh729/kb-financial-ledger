import { createRouter, createWebHistory } from "vue-router";
import App from "../App.vue";
import IncomeExpenseForm from "../components/IncomeExpenseForm.vue";

import History from "../pages/History.vue";
import CalendarPage from "../pages/CalendarPage.vue";
import Asset from "../pages/Asset.vue";
import Statistics from "../pages/Statistics.vue";

const router = createRouter({
  history: createWebHistory("/kb-financial-ledger"),
  routes: [
    { path: "/", component: CalendarPage },
    { path: "/history", component: History },
    { path: "/asset", component: Asset },
    { path: "/statistics", component: Statistics },
    // 다른 라우트들
    { path: "/:pathMatch(.*)*", redirect: "/" }, // 모든 경로를 '/'로 리디렉션
  ],
});

export default router;
