import { defineStore } from "pinia";
import type { Question, Scores, HouseKey, ChatMsg } from "../types/quizTypes";
import rawQuestions from "../data/sorting_hat.json";

const questions = rawQuestions as Question[];
// Baseline is zero in case there is nothing to add or subtract
const ZERO: Scores = { g: 0, r: 0, h: 0, s: 0 };
const KEYS: HouseKey[] = ["g", "r", "h", "s"];

// Easy toggle from localStorage to STORAGE
const STORAGE = localStorage;

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
  state: () => ({
    userName: "" as string,
    currentIndex: 0, // current question displayed
    scores: { ...ZERO } as Scores, // accumulated points
    selections: Array<Selection>(questions.length).fill(null) as Selection[], // user’s multiple-choice answers
    finished: false, // true if all questions answered
    messages: [] as ChatMsg[], // persisted chat messages
  }),
  getters: {
    // Total number of questions
    totalQuestions: () => questions.length,

    // % of questions answered
    progress(state): number {
      const answered = state.selections.filter((x) => x !== null).length;
      return Math.round((answered / questions.length) * 100);
    },

    // Current question object
    currentQuestion(state): Question {
      return (
        questions[state.currentIndex] ?? {
          title: "",
          answers: [],
        }
      );
    },

    // Navigation helpers
    isFirst(state): boolean {
      return state.currentIndex === 0;
    },
    isLast(state): boolean {
      return state.currentIndex === questions.length - 1;
    },
    isComplete(state): boolean {
      return state.selections.every((x) => x !== null);
    },

    // Sorted list of houses by score (highest first, tie-break)
    sortedHouses(state): Readonly<[HouseKey, HouseKey, HouseKey, HouseKey]> {
      const arr = [...KEYS].sort((a, b) => {
        const diff = state.scores[b] - state.scores[a];
        if (diff !== 0) return diff;
        return KEYS.indexOf(a) - KEYS.indexOf(b);
      }) as [HouseKey, HouseKey, HouseKey, HouseKey];
      return arr;
    },

    // The current top house — the user’s likely result
    topHouse(): HouseKey {
      return this.sortedHouses[0];
    },

    // Expose full questions array for iteration
    questions: () => questions,
  },

  actions: {
    setUserName(name: string) {
      // TODO: add string utils for safety, trimming, capitalizing, etc.
      this.userName = name.trim();
      this.persist();
    },
    /* On user selection, adjust score and question position */
    selectAnswer(answerIndex: number) {
      const qIdx = this.currentIndex;
      const prevSel = this.selections[qIdx];
      const nextSel = answerIndex;
      if (prevSel === nextSel) return; // no change

      const cq = this.currentQuestion;

      // safely read previous scores
      const prevScores =
        prevSel != null && cq.answers[prevSel]
          ? cq.answers[prevSel].scores
          : ZERO;

      // Leave if out of bounds (unlikely because controlled in UX template)
      const nextAnswer = cq.answers[nextSel];
      if (!nextAnswer) return;

      const nextScores = nextAnswer.scores;

      this.scores = add(subtract(this.scores, prevScores), nextScores);
      this.selections[qIdx] = nextSel;
      this.persist();
    },

    /** Move forward one question (if not at end). */
    next() {
      if (!this.isLast) this.currentIndex++;
      this.persist();
    },

    /** Move backward one question (if not at start). */
    prev() {
      if (!this.isFirst) this.currentIndex--;
      this.persist();
    },

    /** Jump to a specific question by index. */
    goTo(index: number) {
      if (index >= 0 && index < questions.length) {
        this.currentIndex = index;
        this.persist();
      }
    },

    /** Reset the entire quiz tod defaults. */
    reset() {
      this.userName = "";
      this.currentIndex = 0;
      this.scores = { ...ZERO };
      this.selections = Array<Selection>(questions.length).fill(null);
      this.finished = false;
      this.messages = [];

      // remove persistence
      if (typeof window !== "undefined") {
        STORAGE.removeItem(STORAGE_KEY);
      }
    },

    /** Mark the quiz as complete */
    finish() {
      if (this.isComplete) {
        this.finished = true;
        this.persist();
      }
    },

    // Chat actions for QuizChat.vue
    addMessage(msg: ChatMsg) {
      this.messages.push(msg);
      this.persist();
    },

    // Id or role is not patched
    updateMessage(id: string, patch: Partial<Omit<ChatMsg, "id" | "role">>) {
      const idx = this.messages.findIndex((m) => m.id === id); // prevent "possibly undefined"
      if (idx < 0) return;

      const current = this.messages[idx];
      if (!current) return; // extra safety

      // Merge
      const merged: ChatMsg = { ...current, ...patch };

      // To CLEAR the typing bubble, pass { typing: undefined }.
      if ("typing" in patch && patch.typing === undefined) {
        delete (merged as any).typing;
      }

      this.messages[idx] = merged;
      this.persist();
    },

    clearMessages() {
      this.messages = [];
      this.persist();
    },

    hydrate() {
      if (typeof window === "undefined") return; // SSR guard
      try {
        const raw = STORAGE.getItem(STORAGE_KEY);
        if (!raw) return;

        const data = JSON.parse(raw) as Partial<{
          currentIndex: number;
          scores: Scores;
          selections: Selection[];
          finished: boolean;
          userName: string;
          messages: ChatMsg[];
        }>;

        if (typeof data.currentIndex === "number")
          this.currentIndex = data.currentIndex;
        if (data.scores) this.scores = data.scores;
        if (Array.isArray(data.selections)) this.selections = data.selections;
        if (typeof data.finished === "boolean") this.finished = data.finished;
        if (typeof data.userName === "string") this.userName = data.userName;
        if (Array.isArray(data.messages)) this.messages = data.messages;
      } catch {
        /* ignore safely */
      }
    },

    /** Save current progress into STORAGE. */
    persist() {
      if (typeof window === "undefined") return; // SSR guard
      STORAGE.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentIndex: this.currentIndex,
          scores: this.scores,
          selections: this.selections,
          finished: this.finished,
          userName: this.userName,
          messages: this.messages,
        })
      );
    },
  },
});
