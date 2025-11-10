<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import Chart from "chart.js/auto";

const props = defineProps<{
  labels: string[];
  values: number[];
  total: number;
  ariaLabel?: string;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasSupported = ref(true);
let chartInstance: Chart | null = null;

function buildChart() {
  if (!canvasRef.value || !(canvasRef.value.getContext)) {
    canvasSupported.value = false;
    return;
  }
  const ctx = canvasRef.value.getContext("2d");
  if (!ctx) {
    canvasSupported.value = false;
    return;
  }

  // destroy previous if re-building
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: props.labels,
      datasets: [
        {
          data: props.values,
          backgroundColor: ["#F87171", "#60A5FA", "#34D399", "#FBBF24"],
          hoverOffset: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw as number;
              const pct = props.total
                ? ((value / props.total) * 100).toFixed(1)
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
}

onMounted(buildChart);
onBeforeUnmount(() => {
  chartInstance?.destroy();
  chartInstance = null;
});

// Update the chart if props change
watch(
  () => [props.labels, props.values, props.total],
  () => {
    if (!chartInstance) return buildChart();
    chartInstance.data.labels = props.labels;
    chartInstance.data.datasets[0].data = props.values;
    chartInstance.update();
  },
  { deep: true }
);
</script>

<template>
  <div class="chart-wrapper" :aria-label="ariaLabel || 'Score distribution chart'">
    <canvas v-if="canvasSupported" ref="canvasRef" class="chart-canvas"></canvas>
    <div v-else class="fallback">
      <p>Graph view not supported in this browser.</p>
    </div>
    <noscript>
      <div class="fallback">
        <p>Enable JavaScript to view the chart.</p>
      </div>
    </noscript>
  </div>
</template>

<style scoped>
.chart-wrapper {
  width: min(90vw, 420px);
  aspect-ratio: 1 / 1;
  margin: 0 auto;
  position: relative;
}
.chart-canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
@supports not (aspect-ratio: 1 / 1) {
  .chart-wrapper::before {
    content: "";
    display: block;
    padding-top: 100%;
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
</style>
