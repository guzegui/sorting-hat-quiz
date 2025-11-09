<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue: boolean
  title?: string
  labelledby?: string   // id for aria-labelledby
  maxHeightVh?: number  // e.g. 70
}>(), {
  modelValue: false,
  title: '',
  labelledby: '',
  maxHeightVh: 70,
})

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()
const panel = ref<HTMLElement | null>(null)

function close() { emit('update:modelValue', false) }

// --- focus trap + scroll lock ---
let previousActive: Element | null = null

function focusFirst() {
  if (!panel.value) return
  const focusables = panel.value.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  ;(focusables[0] ?? panel.value).focus()
}

watch(() => props.modelValue, (open) => {
  if (typeof window === 'undefined') return
  const body = document.body
  if (open) {
    previousActive = document.activeElement
    body.style.overflow = 'hidden' // lock
    setTimeout(focusFirst, 0)
  } else {
    body.style.overflow = ''       // unlock
    if (previousActive && (previousActive as HTMLElement).focus) {
      (previousActive as HTMLElement).focus()
    }
  }
})

// ESC to close
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) {
    e.preventDefault()
    close()
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <teleport to="body">
    <transition name="sheet">
      <div v-if="modelValue" class="fixed inset-0 z-50">
        <!-- Backdrop -->
        <button
          type="button"
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          aria-label="Close"
          @click="close"
        />

        <!-- Panel -->
        <div
          ref="panel"
          class="absolute inset-x-0 bottom-0 max-w-2xl mx-auto rounded-t-2xl border border-neutral-800 border-b-0 bg-neutral-900/95 shadow-2xl"
          role="dialog"
          :aria-modal="true"
          :aria-labelledby="labelledby || undefined"
          :aria-label="!labelledby && title ? title : undefined"
        >
          <div class="flex justify-center pt-2">
            <div class="h-1.5 w-10 rounded-full bg-neutral-700" />
          </div>

          <header class="px-4 pt-3 pb-2 flex items-center justify-between">
            <h2 v-if="title" :id="labelledby" class="text-sm font-medium text-neutral-300">
              {{ title }}
            </h2>
            <button
              type="button"
              class="rounded-lg px-2 py-1 text-neutral-400 hover:text-neutral-200"
              @click="close"
            >✕</button>
          </header>

          <!-- Body (scrolls independently) -->
          <div
            class="px-4 pb-4 overflow-y-auto"
            :style="{ maxHeight: `calc(${maxHeightVh}vh - 3.5rem)` }"
          >
            <slot />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
/* Slide-up animation for the sheet panel */
.sheet-enter-active, .sheet-leave-active {
  transition: opacity .16s ease, transform .16s ease;
}
.sheet-enter-from, .sheet-leave-to {
  opacity: .98;
  transform: translateY(12px);
}
</style>
