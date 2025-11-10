<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <!-- relative positioning + hidden overflow keeps layout stable -->
  <div class="relative min-h-screen overflow-hidden">
    <RouterView v-slot="{ Component }">
      <Transition name="page-transition" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>
