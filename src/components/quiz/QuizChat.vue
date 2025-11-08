<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useQuizStore } from "../../stores/quiz";

const quiz = useQuizStore();
const { currentQuestion, currentIndex, selections } = storeToRefs(quiz);

// add "typing?: true" so a message can render as the dot bubble first
type Msg = { role: "bot" | "user"; text: string; id: string; typing?: true };
const messages = ref<Msg[]>([]);
const scroller = ref<HTMLDivElement | null>(null);

// de-dupe guards
const lastQuestionShown = ref<number>(-1);
const echoedSelections = new Set<string>();

const uid = () => Math.random().toString(36).slice(2);

function scrollToBottom() {
  nextTick(() => {
    scroller.value?.scrollTo({
      top: scroller.value.scrollHeight,
      behavior: "smooth",
    });
  });
}

function pushUser(text: string) {
  messages.value.push({ role: "user", text, id: uid() });
  scrollToBottom();
}

// show typing as a message, then morph it into the real question in-place
function showQuestionWithTyping(qText: string, delay = 450) {
  const id = uid();
  // 1) push a typing message (same spot it will live)
  messages.value.push({ role: "bot", text: "", id, typing: true });
  scrollToBottom();

  // 2) after delay, replace the SAME message (same id) with the real text
  setTimeout(() => {
    const idx = messages.value.findIndex((m) => m.id === id);
    if (idx !== -1) {
      messages.value[idx] = { role: "bot", text: qText, id }; // no typing flag
      scrollToBottom();
    }
  }, delay);
}

// when the question index changes, render typing -> question once
watch(
  currentIndex,
  (idx) => {
    if (idx === lastQuestionShown.value) return;
    const t = (currentQuestion.value.title || "").trim();
    if (!t) return;
    showQuestionWithTyping(t, 450);
    lastQuestionShown.value = idx;
  },
  { immediate: true }
);

// echo the user’s choice once (slight delay so it feels natural)
watch(
  selections,
  (sel) => {
    const i = currentIndex.value;
    const pick = sel[i];
    if (pick == null) return;

    const key = `${i}:${pick}`;
    if (echoedSelections.has(key)) return;

    const a = currentQuestion.value.answers[pick];
    if (!a?.title) return;

    setTimeout(() => {
      pushUser(a.title);
      echoedSelections.add(key);
    }, 180);
  },
  { deep: true }
);

onMounted(scrollToBottom);
</script>


<template>
  <div ref="scroller" class="h-[58vh] sm:h-[62vh] overflow-y-auto pr-1">
    <TransitionGroup name="chat" tag="div" class="space-y-3">
      <div
        v-for="m in messages"
        :key="m.id"
        class="flex items-end gap-2"
        :class="m.role === 'user' ? 'justify-end' : 'justify-start'"
      >
        <!-- avatar (bot on left, user on right) -->
        <div
          v-if="m.role === 'bot'"
          class="shrink-0 h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-500/40"
        />

        <!-- bubble -->
        <div
          class="max-w-[80%] px-3 py-2 text-sm leading-relaxed border"
          :class="m.role === 'bot'
            ? 'bg-neutral-800/80 border-neutral-700 rounded-2xl rounded-tl-sm'
            : 'bg-emerald-600/20 border-emerald-600/40 rounded-2xl rounded-tr-sm'"
        >
          <template v-if="m.typing">
            <span class="inline-flex gap-1">
              <span class="animate-pulse">•</span>
              <span class="animate-pulse [animation-delay:120ms]">•</span>
              <span class="animate-pulse [animation-delay:240ms]">•</span>
            </span>
          </template>
          <template v-else>
            {{ m.text }}
          </template>
        </div>

        <div
          v-if="m.role === 'user'"
          class="shrink-0 h-7 w-7 rounded-full bg-emerald-500/20 border border-emerald-500/40"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
/* Subtle, fast chat entrance to avoid visible 'jump' */
.chat-enter-active,
.chat-leave-active { transition: all .14s ease; }
.chat-enter-from { opacity: 0; transform: translateY(4px) scale(.99); }
.chat-leave-to   { opacity: 0; transform: translateY(-4px) scale(.99); }
</style>


<style scoped>
/* subtle slide/scale for chat lines */
.chat-enter-active,
.chat-leave-active {
  transition: all 0.18s ease;
}
.chat-enter-from {
  opacity: 0;
  transform: translateY(6px) scale(0.98);
}
.chat-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.98);
}
</style>
