<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import { useQuizStore } from "../stores/quizStore";

const router = useRouter();
const quiz = useQuizStore();

const askingName = ref(false);
const nameInput = ref("");
const error = ref("");

const hasName = computed(() => !!quiz.userName?.trim());

onMounted(() => {
  // In case hydrate is called elsewhere this is harmless;
  // but ensures Welcome can work standalone too.
  quiz.hydrate();

  // If we already have a name, default to showing the “Continue / Start again” buttons
  // (i.e., do NOT ask for name)
  askingName.value = false;
});

function handleBegin() {
  askingName.value = true;
  // seed with existing name if any (nice UX for edits)
  nameInput.value = quiz.userName || "";
  error.value = "";
  nextTick(() => {
    // input already has autofocus in template
  });
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
  quiz.setUserName(name);
  router.push({ path: "/quiz" });
}

function continueOrBegin() {
  if (hasName.value) {
    router.push({ path: "/quiz" });
  } else {
    handleBegin();
  }
}

function startOver() {
  // wipe everything and ask for a fresh name
  quiz.reset();
  handleBegin();
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

      <!-- Dynamic subheading -->
      <p v-if="!hasName" class="text-neutral-400 text-lg sm:text-xl">
        Find out which Harry Potter house you belong to
      </p>
      <p v-else class="text-neutral-200 text-lg sm:text-xl">
        Welcome back, <span class="font-semibold">{{ quiz.userName }}</span
        >!
      </p>

      <!-- Primary actions (hidden while asking for name) -->
      <div
        v-if="!askingName"
        class="mt-8 flex items-center justify-center gap-3"
      >
        <button
          @click="continueOrBegin"
          class="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all"
        >
          {{ hasName ? "Continue" : "Begin" }}
        </button>

        <!-- Only show Start again if we already have a name -->
        <button
          v-if="hasName"
          @click="startOver"
          class="px-6 py-3 rounded-2xl border border-neutral-700 hover:bg-neutral-800 text-neutral-100 font-semibold transition-all"
        >
          Start again
        </button>
      </div>

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
