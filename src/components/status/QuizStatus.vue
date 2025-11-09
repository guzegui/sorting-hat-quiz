<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useQuizStore } from "../../stores/quizStore";

const quiz = useQuizStore();
const { progress, currentIndex, totalQuestions, userName } = storeToRefs(quiz);
</script>

<template>
  <header
    class="sticky top-0 z-10 -mx-4 px-4 py-3 bg-neutral-950/70 backdrop-blur"
  >
    <div class="max-w-3xl mx-auto">
      <div
        class="flex items-center justify-between text-xs text-neutral-400 mb-2"
      >
        <span>{{
          userName
            ? `Sorting ${userName} in progress...`
            : "Sorting in progress..."
        }}</span>
        <span>{{ currentIndex + 1 }} / {{ totalQuestions }}</span>
      </div>
      <div class="h-1.5 rounded-full bg-neutral-800 overflow-hidden">
        <div
          class="h-full bg-emerald-600 transition-[width]"
          :style="{ width: Math.min(100, Math.max(0, progress)) + '%' }"
        />
      </div>
    </div>
  </header>
</template>
