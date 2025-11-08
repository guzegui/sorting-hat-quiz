import { defineStore } from "pinia";
import { computed } from "vue";
import type { Question, Scores, HouseKey } from "../types/quiz";
import rawQuestions from "../data/sorting_hat.json";

const questions = rawQuestions as Question[];
// Baseline is zero in case there is nothing to add or subtract
const ZERO: Scores = { g: 0, r: 0, h: 0, s: 0 };
const KEYS: HouseKey[] = ["g", "r", "h", "s"];
// Local Storage key for persistence
const STORAGE_KEY = "sorting-hat-quiz";

// Add and subtract scores after each question
function add(a: Scores, b: Scores): Scores {
  return { g: a.g + b.g, r: a.r + b.r, h: a.h + b.h, s: a.s + b.s };
}
function subtract(a: Scores, b: Scores): Scores {
  return { g: a.g - b.g, r: a.r - b.r, h: a.h - b.h, s: a.s - b.s };
}

// Questions are stored as indexes, null in case of no answer
type Selection = number | null;

export const useQuizStore = defineStore("quiz", {
  // -----------------------------------
  // STATE
  // -----------------------------------
  state: () => ({
    userName: "" as string,
    currentIndex: 0, // current question displayed
    scores: { ...ZERO } as Scores, // accumulated points
    selections: Array<Selection>(questions.length).fill(null) as Selection[], // user’s multiple-choice answers
    finished: false, // true if all questions answered
  }),
});


