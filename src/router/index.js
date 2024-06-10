import { createRouter, createWebHistory } from "vue-router";
import Home from '../App.vue';
import IncomeExpenseForm from "../components/IncomeExpenseForm.vue";

// import Products from "@/components/Products.vue";
// import Login from "@/components/Login.vue";
// import Signup from "@/components/Signup.vue";
// import Home from "@/components/Home.vue";
// import Product from "@/components/Product.vue";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/income-expense-form',
    name: 'IncomeExpenseForm',
    component: IncomeExpenseForm
  }
];

const router = createRouter({
  history: createWebHistory('/my-app.vue'),
  routes
});
// const router = createRouter({
//   history: createWebHistory(process.env.BASE_URL),
//   routes: [
//     // { path: "/", component: Home },
//     // // { path: "/products", component: Products },
//     // {
//     //   path: "/products", // 중첩라우팅
//     //   component: Products, 
//     //   children: [{ name: "Product", path: "/product/:prodNo", component: Product }],
//     // },
//     // { path: "/login", component: Login },
//     // { path: "/signup", component: Signup },
//     // // { name: "Product", path: "/product/:prodNo", component: Product },
//   ],
// });

export default router;