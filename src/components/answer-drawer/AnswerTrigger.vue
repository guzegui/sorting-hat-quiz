<script setup lang="ts">
import { ref } from 'vue'
import AnswerSheet from './AnswerSheet.vue'

const open = ref(false)
</script>

<template>
  <div class="flex items-center justify-center">
    <button
      type="button"
      class="rounded-full px-5 py-2.5 text-sm font-medium border border-neutral-700 bg-neutral-900/60 hover:border-emerald-500 transition-colors"
      @click="open = true"
    >
      Choose answer
    </button>
  </div>

  <AnswerSheet v-model="open" />
</template>
