<template>
      <Line id="my-chart-id" :options="chartOptions" :data="chartData" />
</template>
<script setup>
import { ref, computed } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const chartData = ref({
  labels: ["January", "February", "March", "April", "May", "June", "July"],

  datasets: [
    {
      label: "Data One",
      backgroundColor: "#f87979",
      data: [40, 39, 10, 40, 39, 80, 40],
    },
  ],
});
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "title",
      amrgin: {
        left: 0,
      },
      padding: {
        top: 0,
        bottom: 30,
      },
    },
  },
});
</script>
<style></style>
