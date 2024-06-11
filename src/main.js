import { createApp } from 'vue';
import './assets/css/style.css';
import App from './App.vue';

import router from './router';
import 'bootstrap/dist/css/bootstrap.css';
import './assets/css/income-expense-form.css';
const app = createApp(App);

app.use(router);
app.mount('#app');
