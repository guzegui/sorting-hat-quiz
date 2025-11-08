<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
function handleBegin() {
  alert("navigating");
}
</script>

<template>
  <main
    class="min-h-screen flex flex-col items-center justify-center text-center bg-neutral-950 text-neutral-100 px-6"
  >
    <div class="space-y-6">
      <h1 class="text-4xl sm:text-5xl font-bold tracking-tight">
        Face the Sorting Hat!
      </h1>
      <p class="text-neutral-400 text-lg sm:text-xl">
        Find out which Harry Potter house you belong to
      </p>
      <button
        @click="handleBegin"
        class="mt-8 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all"
      >
        Begin
      </button>
    </div>
  </main>
</template>
