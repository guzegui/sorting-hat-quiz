<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuizStore } from "../stores/quiz";

const router = useRouter();
const quiz = useQuizStore();

const askingName = ref(false);
const nameInput = ref("");
const error = ref("");

function handleBegin() {
  askingName.value = true;
}

function cancel() {
  askingName.value = false;
  nameInput.value = "";
  error.value = "";
}

function confirmName() {
  const name = nameInput.value.trim();
  if (!name) {
    error.value = "Please enter your name.";
    return;
  }

  // Prefer using an action if you added it:
  quiz.setUserName(name);

  // TODO: replace with toast alert
  alert(`Welcome, ${name}!`);

  router.push({ path: "/quiz" }); //
}
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center text-center bg-neutral-950 text-neutral-100 px-6"
  >
    <div class="space-y-6">
      <h1 class="text-4xl sm:text-5xl font-bold tracking-tight">
        Face the Sorting Hat!
      </h1>
      <p class="text-neutral-400 text-lg sm:text-xl">
        Find out which Harry Potter house you belong to
      </p>

      <!-- Begin button (hidden while asking for name) -->
      <button
        v-if="!askingName"
        @click="handleBegin"
        class="mt-8 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all"
      >
        Begin
      </button>

      <!-- Name prompt -->
      <div
        v-else
        class="mt-8 w-full max-w-md mx-auto text-left rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4"
      >
        <label for="playerName" class="block text-sm text-neutral-300 mb-2">
          What’s your name?
        </label>
        <input
          id="playerName"
          v-model="nameInput"
          type="text"
          placeholder="Type your name…"
          class="w-full rounded-xl bg-neutral-950 border border-neutral-700 px-3 py-2 outline-none focus:border-emerald-500"
          @keydown.enter.prevent="confirmName"
          autofocus
        />
        <p v-if="error" class="mt-2 text-xs text-red-400">{{ error }}</p>

        <div class="mt-4 flex gap-2 justify-end">
          <button
            type="button"
            class="rounded-xl px-4 py-2 border border-neutral-700 hover:bg-neutral-800"
            @click="cancel"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-xl px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
            @click="confirmName"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
