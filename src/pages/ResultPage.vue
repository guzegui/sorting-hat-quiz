<script setup lang="ts">
import { useRouter } from "vue-router";
import { useQuizStore } from "../stores/quizStore";
import ResultDetails from "../components/ResultDetails.vue";

const router = useRouter();
const quiz = useQuizStore();

function startAgain() {
  quiz.reset();
  router.push("/"); // back to the beginning
}
</script>

<template>
  <section class="result-page">
    <ResultDetails />

    <div class="actions" style="margin-top: 1rem;">
      <button type="button" @click="startAgain">Start again</button>
    </div>
  </section>
</template>

<style scoped>
.result-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 1rem;
}
.actions button {
  padding: .6rem 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  cursor: pointer;
}
</style>
