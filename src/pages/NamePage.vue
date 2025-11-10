<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuizStore } from "../stores/quizStore";

const router = useRouter();
const quiz = useQuizStore();

const nameInput = ref(quiz.userName || "");
const error = ref("");

function confirmName() {
  const name = nameInput.value.trim();
  if (!name) { error.value = "Please enter your name."; return; }
  quiz.setUserName(name);
  router.push("/quiz");
}

function cancel() {
  router.back();
}
</script>

<template>
  <section class="min-h-screen flex items-center justify-center bg-neutral-950 text-neutral-100 px-6">
    <div class="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/70 p-5">
      <h2 class="text-2xl font-semibold mb-3">What’s your name?</h2>
      <input
        v-model="nameInput"
        type="text"
        placeholder="Type your name…"
        class="w-full rounded-xl bg-neutral-950 border border-neutral-700 px-3 py-2 outline-none focus:border-emerald-500"
        @keydown.enter.prevent="confirmName"
        autofocus
      />
      <p v-if="error" class="mt-2 text-xs text-red-400">{{ error }}</p>

      <div class="mt-4 flex gap-2 justify-end">
        <button class="rounded-xl px-4 py-2 border border-neutral-700 hover:bg-neutral-800" @click="cancel">
          Cancel
        </button>
        <button class="rounded-xl px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold" @click="confirmName">
          Continue
        </button>
      </div>
    </div>
  </section>
</template>
