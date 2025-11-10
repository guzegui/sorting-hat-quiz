<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { useQuizStore } from "../../stores/quizStore";

const router = useRouter();

const quiz = useQuizStore();
const { currentQuestion, currentIndex, selections, messages, isFinished } =
  storeToRefs(quiz);

const scroller = ref<HTMLDivElement | null>(null);

// de-dupe guards (i.e. unnecesary duplication)
const seenBotTexts = new Set<string>();
const seenUserTexts = new Set<string>();
const echoedSelections = new Set<string>();

// Seed once, even if the store hydrates later
let seeded = false;
function seedGuards() {
  if (seeded) return;

  // seed bot/user text sets from existing messages
  for (const m of messages.value) {
    if (m.role === "bot" && m.text) seenBotTexts.add(m.text.trim());
    if (m.role === "user" && m.text) seenUserTexts.add(m.text.trim());
  }

  // seed echoedSelections from current selections + already-present user bubbles
  selections.value.forEach((pick, i) => {
    if (pick == null) return;
    const ans = quiz.currentQuestion.answers
      ? quiz.questions[i]?.answers[pick]
      : undefined;
    const title = ans?.title?.trim();
    if (!title) return;
    if (
      messages.value.some((m) => m.role === "user" && m.text?.trim() === title)
    ) {
      echoedSelections.add(`${i}:${pick}`);
    }
  });

  seeded = true;
}

// run also if messages arrive after hydration
watch(messages, () => seedGuards(), { immediate: true });

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
  quiz.addMessage({ role: "user", text, id: uid() });
  scrollToBottom();
}

function showQuestionWithTyping(qText: string, delay = 450) {
  const t = (qText || "").trim();
  if (!t || seenBotTexts.has(t)) return; // extra guard for dupes

  const id = uid();
  quiz.addMessage({ role: "bot", text: "", id, typing: true });
  scrollToBottom();

  setTimeout(() => {
    // When patch.typing === undefined, delete
    quiz.updateMessage(id, { text: qText, typing: undefined });
    seenBotTexts.add(t); // remember it was shown
    scrollToBottom();
  }, delay);
}

// when the question index changes, render typing -> question once
watch(
  currentIndex,
  () => {
    const t = (currentQuestion.value.title || "").trim();
    if (!t) return;
    // if already shown, skip
    if (seenBotTexts.has(t)) return;
    showQuestionWithTyping(t, 450);
  },
  { immediate: false }
);

watch(
  selections,
  (sel) => {
    const i = currentIndex.value;
    const pick = sel[i];
    if (pick == null) return;

    const key = `${i}:${pick}`;
    if (echoedSelections.has(key)) return;

    const a = currentQuestion.value.answers[pick];
    const title = a?.title?.trim();
    if (!title || seenUserTexts.has(title)) return;

    setTimeout(() => {
      pushUser(title);
      echoedSelections.add(key);
      seenUserTexts.add(title);
    }, 180);
  },
  { deep: true }
);

watch(isFinished, (isDone) => {
  if (isDone) router.push("/result");
});

onMounted(scrollToBottom);

// After seeding, post the initial question once if needed
onMounted(() => {
  // seedGuards already ran because of immediate:true
  const t = (currentQuestion.value.title || "").trim();
  if (t && !seenBotTexts.has(t)) {
    showQuestionWithTyping(t, 450);
  }
});
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
          :class="
            m.role === 'bot'
              ? 'bg-neutral-800/80 border-neutral-700 rounded-2xl rounded-tl-sm'
              : 'bg-emerald-600/20 border-emerald-600/40 rounded-2xl rounded-tr-sm'
          "
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
/* Smooth, more pronounced chat animation */
.chat-enter-active,
.chat-leave-active {
  transition: transform 420ms var(--ease-page, cubic-bezier(0.22, 1, 0.36, 1)),
    opacity 420ms var(--ease-page, cubic-bezier(0.22, 1, 0.36, 1));
}

/* Base enter */
.chat-enter-from {
  opacity: 0;
  transform: translateY(14px) scale(0.94);
}

/* Directional nudge by role */
.justify-end.chat-enter-from {
  /* user messages */
  transform: translateY(14px) translateX(18px) scale(0.92);
}
.justify-start.chat-enter-from {
  /* bot messages */
  transform: translateY(10px) translateX(-10px) scale(0.94);
}

/* Keep the exit subtle */
.chat-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

/* --- User "pop/glow" pulse --- */
@keyframes userBubblePulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.55);
    transform: scale(0.92);
  }
  40% {
    box-shadow: 0 0 0 16px rgba(16, 185, 129, 0.25);
    transform: scale(1.05);
  }
  70% {
    box-shadow: 0 0 0 22px rgba(16, 185, 129, 0.1);
    transform: scale(1.02);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    transform: scale(1);
  }
}
.justify-end.chat-enter-active > div:nth-child(1) {
  animation: userBubblePulse 800ms ease-out both;
  will-change: box-shadow, transform;
}

/* --- User avatar pop --- */
@keyframes userAvatarPop {
  0% {
    opacity: 0;
    transform: scale(0.7) rotate(-8deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.08) rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}
.justify-end.chat-enter-active > div:nth-child(2) {
  animation: userAvatarPop 600ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
</style>
