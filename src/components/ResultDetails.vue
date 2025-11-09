<script setup lang="ts">
import { computed } from "vue";
import { useQuizStore } from "../stores/quizStore";
import type { HouseKey } from "../types/quizTypes";

const quiz = useQuizStore();

const houseNames: Record<HouseKey, string> = {
  g: "Gryffindor",
  r: "Ravenclaw",
  h: "Hufflepuff",
  s: "Slytherin",
};

const topHouseName = computed(() => houseNames[quiz.topHouse]);

// If you want the breakdown displayed in a stable, classic G/R/H/S order:
const breakdown = computed(() => [
  { key: "g" as HouseKey, label: "Gryffindor", points: quiz.scores.g },
  { key: "r" as HouseKey, label: "Ravenclaw", points: quiz.scores.r },
  { key: "h" as HouseKey, label: "Hufflepuff", points: quiz.scores.h },
  { key: "s" as HouseKey, label: "Slytherin", points: quiz.scores.s },
]);

// (Optional) If you prefer showing from highest to lowest, use:
// const breakdown = computed(() =>
//   quiz.sortedHouses.map(k => ({ key: k, label: houseNames[k], points: quiz.scores[k] }))
// );
</script>

<template>
  <div class="result-details">
    <h1 class="headline">You belong to {{ topHouseName }}</h1>

    <ul class="scores">
      <li v-for="h in breakdown" :key="h.key">
        <strong>{{ h.label }}:</strong> {{ h.points }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.headline {
  font-size: 1.6rem;
  margin-bottom: 1rem;
}
.scores {
  list-style: none;
  padding: 0;
  margin: 0;
}
.scores li {
  padding: .35rem 0;
  border-bottom: 1px dashed #e6e6e6;
}
.scores li:last-child {
  border-bottom: none;
}
</style>
