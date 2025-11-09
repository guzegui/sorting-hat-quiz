<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useQuizStore } from '../../stores/quizStore'
import BottomDrawer from './BottomDrawer.vue'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

function close() { emit('update:modelValue', false) }

const quiz = useQuizStore()
const { currentQuestion, currentIndex, isLast, selections } = storeToRefs(quiz)

function pick(i: number) {
  quiz.selectAnswer(i)
  // give the chat a moment to echo user's bubble
  setTimeout(() => {
    if (!isLast.value) quiz.next()
    else quiz.finish()
  }, 220)
  close()
}
</script>

<template>
  <BottomDrawer
    :model-value="modelValue"
    @update:modelValue="emit('update:modelValue', $event)"
    :title="currentQuestion.title"
    labelledby="answer-sheet-title"
    :max-height-vh="70"
  >
    <ul role="listbox" aria-labelledby="answer-sheet-title" class="grid gap-2">
      <li v-for="(a, i) in currentQuestion.answers" :key="i">
        <button
          role="option"
          type="button"
          class="w-full text-left rounded-xl border px-4 py-3 transition-colors"
          :class="[
            selections[currentIndex] === i
              ? 'border-emerald-500 bg-emerald-600/20'
              : 'border-neutral-700 bg-neutral-900/60 hover:border-emerald-500'
          ]"
          @click="pick(i)"
        >
          {{ a.title }}
        </button>
      </li>
    </ul>
  </BottomDrawer>
</template>
