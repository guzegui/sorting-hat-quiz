<script setup lang="ts">
import QuizStatus from "../components/status/QuizStatus.vue";
import QuizChat from "../components/quiz/QuizChat.vue";
import AnswerComponent from "../components/quiz/AnswerComponent.vue";
</script>

<template>
  <main class="min-h-screen bg-neutral-950 text-neutral-100">
    <section class="max-w-3xl mx-auto px-4 py-6 space-y-4">
      <QuizStatus />

      <!-- Chat card -->
      <div
        class="relative rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden"
      >
        <!-- Thread area -->
        <div class="p-4">
          <QuizChat />
        </div>

        <!-- Sticky answer picker (like WhatsApp input) -->
        <div class="sticky bottom-0 z-10">
          <!-- gradient + blur to separate from thread -->
          <div
            class="pointer-events-none h-8 -mb-2 bg-linear-to-t from-neutral-900/90 to-transparent"
          ></div>
          <div
            class="backdrop-blur bg-neutral-900/80 border-t border-neutral-800 p-4"
          >
            <div class="max-w-2xl mx-auto">
              <AnswerComponent />
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
