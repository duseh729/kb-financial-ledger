<template>
  <div>
    <div class="monthlyChartWrapper">
      <Doughnut id="my-chart-id" :options="chartOptions" :data="chartData" />
    </div>
    {{props.title}}
  </div>
</template>
<script setup>
import { Doughnut, Pie } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import DetailChart from "./DetailChart.vue";
import { ref, toRef } from "vue";
ChartJS.register(ArcElement, Tooltip, Legend);
const props = defineProps(['title'])
const category = ref("");

const handleClick = (evt, item, legend) => {
  category.value = item.text;
};
const chartData = ref({
  labels: ["식비", "교통비", "취미", "기타"],

  datasets: [
    {
      backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
      data: [40, 20, 80, 10],
    },
  ],
});
const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      position: "right",
      labels: {
        font: {
          lineHeight: 10,
          family: "Arial",
          size: 15,
        },
      },
      onClick: handleClick,
    },
    title: {
      display: true,
      text: toRef(props.title),
      margin: {
        left: 100,
      },
      padding: {
        top: 60,
      },
    },
  },
});
</script>
<style></style>
