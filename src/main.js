import { createApp } from "vue";
import "./assets/css/style.css";
import App from "./App.vue";

import router from "./router";
import "bootstrap/dist/css/bootstrap.css";
import VCalendar from "v-calendar";

const app = createApp(App);

app.use(router);
// Use VCalendar
app.use(VCalendar, {
  componentPrefix: "vc", // Use <vc-calendar /> instead of <v-calendar />
});
app.mount("#app");
