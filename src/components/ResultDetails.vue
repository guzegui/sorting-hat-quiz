<script setup lang="ts">
import { computed } from "vue";
import { useQuizStore } from "../stores/quizStore";
import { houseNames } from "../types/quizTypes";

const quiz = useQuizStore();

const topHouseName = computed(() => houseNames[quiz.topHouse]);

// Score display in descending order
const breakdown = computed(() =>
  quiz.sortedHouses.map((k) => ({
    key: k,
    label: houseNames[k],
    points: quiz.scores[k],
  }))
);
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
  padding: 0.35rem 0;
  border-bottom: 1px dashed #e6e6e6;
}
.scores li:last-child {
  border-bottom: none;
}
</style>
