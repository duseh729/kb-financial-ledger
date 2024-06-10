import { createRouter, createWebHistory } from "vue-router";
import App from '../App.vue';
import IncomeExpenseForm from "../components/IncomeExpenseForm.vue";

import Home from "../pages/Home.vue";

const router = createRouter({
  history: createWebHistory('/my-app.vue'),
  routes: [
    { path: "/", component: Home }
  ],
});

export default router;