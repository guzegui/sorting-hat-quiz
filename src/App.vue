<script setup lang="ts">
import { onMounted } from "vue";
import { useQuizStore } from "./stores/quizStore";
import PageTransition from "./components/PageTransition.vue";

const quiz = useQuizStore();

onMounted(() => {
  quiz.hydrate();
});
</script>

<template>
  <main class="min-h-screen bg-neutral-950 text-neutral-100">
    <PageTransition />
  </main>
</template>
