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

    <div class="actions" style="margin-top: 1rem">
      <button type="button" @click="startAgain">Start again</button>
    </div>
  </section>
</template>

<style scoped>

/* Button centered under grid */
.actions {
  margin-top: 1.6rem;
  text-align: center;
}
.actions button {
  padding: 0.7rem 1.2rem;
  border: none;
  background-color: #34d399;
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 10px;
  cursor: pointer;
}
.actions button:hover {
  background-color: #2bb47b;
}
</style>
