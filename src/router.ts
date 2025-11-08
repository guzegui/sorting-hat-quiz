import { createMemoryHistory, createRouter } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import QuizPage from "./pages/QuizPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/quiz", component: QuizPage },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
