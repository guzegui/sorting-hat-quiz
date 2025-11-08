<script setup lang="ts">
defineProps<{ index: number; title: string }>()
</script>

<template>
  <header class="space-y-1">
    <p class="text-sm text-neutral-400">Question {{ index }}</p>
    <h2 class="text-xl sm:text-2xl font-semibold leading-snug">
      {{ title }}
    </h2>
  </header>
</template>
