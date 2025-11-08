<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useQuizStore } from "../../stores/quiz";

const quiz = useQuizStore();
const { currentQuestion, currentIndex, isLast, selections } = storeToRefs(quiz);

function pick(i: number) {
  quiz.selectAnswer(i);
  // Let QuizChat echo the user bubble first, then advance
  setTimeout(() => {
    if (!isLast.value) quiz.next();
    else quiz.finish();
  }, 250);
}
</script>

<template>
  <!-- centered button group, like quick-replies -->
  <div class="flex flex-wrap items-center justify-center gap-2">
    <button
      v-for="(a, i) in currentQuestion.answers"
      :key="i"
      type="button"
      class="rounded-full px-4 py-2 text-sm border transition-colors"
      :class="[
        selections[currentIndex] === i
          ? 'border-emerald-500 bg-emerald-600/20'
          : 'border-neutral-700 bg-neutral-900/60 hover:border-emerald-500',
      ]"
      @click="pick(i)"
    >
      {{ a.title }}
    </button>
  </div>
</template>
