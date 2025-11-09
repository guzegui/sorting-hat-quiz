<script setup lang="ts">
import { onMounted } from "vue";
import { useQuizStore } from "./stores/quizStore";

const quiz = useQuizStore();

onMounted(() => {
  quiz.hydrate();
});
</script>

<template>
  <RouterView />
</template>
