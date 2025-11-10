<script setup lang="ts">
import { computed } from "vue";
import { useQuizStore } from "../../stores/quizStore";
import { houseNames } from "../../types/quizTypes";
import PieChart from "./PieChart.vue";
import ScoreList from "./ScoreList.vue";

const quiz = useQuizStore();

const topHouseName = computed(() => houseNames[quiz.topHouse]);

const sortedKeys = computed(() => quiz.sortedHouses);
const labels = computed(() => sortedKeys.value.map((k) => houseNames[k]));
const values = computed(() => sortedKeys.value.map((k) => quiz.scores[k]));
const total = computed(() => values.value.reduce((a, b) => a + b, 0));
const items = computed(() =>
  sortedKeys.value.map((k) => ({ label: houseNames[k], value: quiz.scores[k] }))
);
</script>

<template>
  <section class="result-details">
    <h1 class="headline">
      You belong to <span class="house">{{ topHouseName }}</span>
    </h1>

    <div class="grid-2">
      <div class="left">
        <PieChart :labels="labels" :values="values" :total="total" />
      </div>

      <div class="right">
        <ScoreList :items="items" :total="total" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.result-details {
  margin: 0 auto;
  padding: 2rem 1rem 0rem;
}
.headline {
  text-align: center;
  font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  margin-bottom: 1.5rem;
}
.house {
  background: linear-gradient(90deg, #ffda6a, #ffd0f0, #8dd8ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem 2rem;
  align-items: stretch;
}
.left {
  width: 100%;
}
.right {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* vertically centers the ScoreList */
}

/* 2 columns on medium+ screens */
@media (min-width: 840px) {
  .grid-2 {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
