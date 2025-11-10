import { createApp } from "vue";
import "./assets/styles/index.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import { router } from "./router";

const app = createApp(App);
app.use(createPinia()); // pinia before router so route guard works
app.use(router);
app.mount("#app");
