<script setup lang="ts">
const props = defineProps<{
  items: { label: string; value: number }[];
  total: number;
}>();

function pctOf(value: number) {
  if (!props.total) return "0%";
  return `${((value / props.total) * 100).toFixed(1)}%`;
}
</script>

<template>
  <div class="score-list">
    <ul class="scores" aria-label="Score breakdown">
      <li v-for="it in items" :key="it.label">
        <div class="row">
          <span class="label">{{ it.label }}</span>
          <span class="values">
            <strong class="points">{{ it.value }}</strong>
            <span class="sep">•</span>
            <span class="percent">{{ pctOf(it.value) }}</span>
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.score-list {
  display: flex;
  flex-direction: column;
  justify-content: center; /* vertical centering within column */
}
.scores {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  width: min(90vw, 420px);
}
.scores li {
  padding: 0.6rem 0;
  border-bottom: 1px dashed #ddd;
}
.scores li:last-child {
  border-bottom: none;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
}
.label {
  font-weight: 600;
}
.values {
  display: inline-flex;
  gap: 0.5rem;
  align-items: baseline;
  white-space: nowrap;
}
.points {
  font-variant-numeric: tabular-nums;
}
.sep {
  opacity: 0.5;
}
.percent {
  opacity: 0.8;
}
</style>
