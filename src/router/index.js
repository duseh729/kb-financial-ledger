import { createRouter, createWebHistory } from 'vue-router';
import App from '../App.vue';
import IncomeExpenseForm from '../components/IncomeExpenseForm.vue';

import Home from '../pages/Home.vue';
import History from '../pages/History.vue';
import CalendarPage from '../pages/CalendarPage.vue';
import Asset from '../pages/Asset.vue';
import Statistics from '../pages/Statistics.vue';

const router = createRouter({
    history: createWebHistory('/my-app.vue'),
    routes: [
        { path: '/', component: Home },
        { path: '/history', component: History },
        { path: '/calendar', component: CalendarPage },
        { path: '/asset', component: Asset },
        { path: '/statistics', component: Statistics },
    ],
});

export default router;
