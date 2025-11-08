import { defineStore } from "pinia";
import { computed } from "vue";
import type { Question, Scores, HouseKey } from "../types/quiz";
import rawQuestions from "../data/sorting_hat.json";
