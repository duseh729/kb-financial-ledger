import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/Home.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Home },
    // // { path: "/products", component: Products },
    // {
    //   path: "/products", // 중첩라우팅
    //   component: Products, 
    //   children: [{ name: "Product", path: "/product/:prodNo", component: Product }],
    // },
    // { path: "/login", component: Login },
    // { path: "/signup", component: Signup },
    // // { name: "Product", path: "/product/:prodNo", component: Product },
  ],
});

export default router;