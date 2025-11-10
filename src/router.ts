import { createRouter, createMemoryHistory } from "vue-router";
import HomePage from "./pages/HomePage.vue";
import QuizPage from "./pages/QuizPage.vue";
import ResultPage from "./pages/ResultPage.vue";
import { useQuizStore } from "./stores/quizStore";

const routes = [
  { path: "/", name: "home", component: HomePage },
  { path: "/quiz", name: "quiz", component: QuizPage },
  { path: "/result", name: "result", component: ResultPage },
];

export const router = createRouter({
  history: createMemoryHistory(), // or createWebHistory()
  routes,
});

// Redirect to /result if finished (runs before components mount)
router.beforeEach(async (to) => {
  const quiz = useQuizStore();

  if (quiz.isFinished && to.name !== "result") {
    return { name: "result", replace: true };
  }

  // Optional extras:
  // if (to.name === "result" && !quiz.isFinished) return { name: "home", replace: true };
  return true;
});
