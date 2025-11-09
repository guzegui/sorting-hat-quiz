import { createMemoryHistory, createRouter } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import QuizPage from "./pages/QuizPage.vue";
import ResultPage from "./pages/ResultPage.vue";

const routes = [
  { path: "/", component: HomePage },
  { path: "/quiz", component: QuizPage },
  {
    path: "/result",
    name: "result",
    component: ResultPage,
  },
];

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
});
