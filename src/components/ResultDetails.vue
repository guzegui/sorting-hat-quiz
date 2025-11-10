<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useQuizStore } from "../stores/quizStore";
import { houseNames } from "../types/quizTypes";
import Chart from "chart.js/auto";

const quiz = useQuizStore();

const topHouseName = computed(() => houseNames[quiz.topHouse]);

// Chart
let chartInstance: Chart | null = null;
const labels = computed(() => quiz.sortedHouses.map((k) => houseNames[k]));
const dataValues = computed(() => quiz.sortedHouses.map((k) => quiz.scores[k]));
const totalPoints = computed(() =>
  dataValues.value.reduce((acc, v) => acc + v, 0)
);

// Fallback in case of old browser
const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasSupported = ref(true);

// Calculate percentage
function pctOf(value: number) {
  if (!totalPoints.value) return "0%";
  return `${((value / totalPoints.value) * 100).toFixed(1)}%`;
}

// Checks browser compatibility and renders accordinbly
onMounted(() => {
  if (!canvasRef.value || !canvasRef.value.getContext) {
    canvasSupported.value = false;
    return;
  }
  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) {
    canvasSupported.value = false;
    return;
  }

  try {
    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels.value,
        datasets: [
          {
            data: dataValues.value,
            backgroundColor: ["#F87171", "#60A5FA", "#34D399", "#FBBF24"],
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true, // keep square shape as the container changes
        aspectRatio: 1, // square
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                const pct = totalPoints.value
                  ? ((value / totalPoints.value) * 100).toFixed(1)
                  : "0.0";
                return `${context.label}: ${value} (${pct}%)`;
              },
            },
          },
          legend: {
            position: "bottom",
            labels: { boxWidth: 12 },
          },
        },
      },
    });
  } catch {
    canvasSupported.value = false;
  }
});

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});
</script>

<template>
  <section class="result-details">
    <h1 class="headline">
      You belong to <span class="house">{{ topHouseName }}</span>
    </h1>

    <!-- 2-column area -->
    <div class="grid-2">
      <!-- Left: Chart / fallback -->
      <div class="left">
        <div
          class="chart-wrapper"
          v-if="canvasSupported"
          aria-label="Score distribution chart"
        >
          <canvas ref="canvasRef" class="chart-canvas"></canvas>
        </div>
        <!-- If no compatibility -->
        <div class="fallback" v-else>
          <p>Graph view not supported in this browser.</p>
        </div>
        <noscript>
          <div class="fallback">
            <p>Enable JavaScript to view the chart.</p>
          </div>
        </noscript>
      </div>

      <!-- Right: Breakdown list -->
      <div class="right">
        <ul class="scores" aria-label="Score breakdown">
          <li v-for="k in quiz.sortedHouses" :key="k">
            <div class="row">
              <span class="label">{{ houseNames[k] }}</span>
              <span class="values">
                <strong class="points">{{ quiz.scores[k] }}</strong>
                <span class="sep">•</span>
                <span class="percent">{{ pctOf(quiz.scores[k]) }}</span>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.result-details {
  margin: 0 auto;
  padding: 2rem 1rem 0rem;
}

.headline {
  text-align: center;
  font-size: clamp(1.6rem, 2.5vw, 2.2rem);
  margin-bottom: 1.5rem;
}

.house {
  background: linear-gradient(90deg, #ffda6a, #ffd0f0, #8dd8ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem 2rem;
  align-items: stretch; /* let columns size naturally */
}

.left,
.right {
  width: 100%;
}

.chart-wrapper {
  width: min(90vw, 420px);
  /* Keep square via aspect-ratio (modern browsers) */
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  position: relative;
}

/* Canvas fills wrapper */
.chart-canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

/* Old-browser fallback to maintain square if aspect-ratio unsupported */
@supports not (aspect-ratio: 1 / 1) {
  .chart-wrapper::before {
    content: "";
    display: block;
    padding-top: 100%; /* square */
  }
  .chart-canvas {
    position: absolute;
    inset: 0;
  }
}

.fallback {
  text-align: center;
  color: #777;
  border: 1px dashed #ccc;
  padding: 1rem;
  border-radius: 10px;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: center; /* vertical centering */
}

.scores {
  list-style: none;
  padding: 0;
  margin: 0 auto; /* center the block itself */
  width: min(90vw, 420px); /* keep similar width to chart */
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
/* 2 columns on medium+ screens */
@media (min-width: 840px) {
  .grid-2 {
    grid-template-columns: 1fr 1fr;
  }
  .chart-wrapper,
  .scores {
    width: min(
      42vw,
      420px
    ); /* prevents overflow on narrow but wide viewports */
  }
}
</style>
