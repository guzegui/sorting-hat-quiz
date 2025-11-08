<script setup lang="ts">
import { onMounted } from "vue";
import { useQuizStore } from "./stores/quiz";

const quiz = useQuizStore();

onMounted(() => {
  quiz.hydrate();
});
</script>

<template>
  <RouterView />
</template>
