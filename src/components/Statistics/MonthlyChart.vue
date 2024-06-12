<template>
  <div class="container">
    <div class="monthlyChartWrapper">
      <Doughnut id="my-chart-id" :options="chartOptions" :data="chartData" :key="forceRerender"/>
    </div>
    <ChartIndex :title="props.title" :data="props.data"/>

  </div>
</template>
<script setup>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartIndex from "./ChartIndex.vue";
import { ref, toRef, unref, computed, onMounted, watch } from "vue";
ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({ title: String, data: Array })

const groupByCategory = (data) => {
    if (!data || !Array.isArray(data)) {
      return {};
    }
    return data.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = 0;
        }
        acc[item.category] += item.amount;
        return acc;
    }, {});
};

const groupedData = computed(() => groupByCategory(props.data));
const amountArr = computed(() => Object.values(groupedData.value));
const categoryArr = computed(() => Object.keys(groupedData.value))
const forceRerender = ref(0);

const chartData = ref({
  labels: categoryArr,
  datasets: [
    {
      backgroundColor: ["#41B883", "#E46651", "#00D8FF", "#DD1B16"],
      data: amountArr,
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      labels: {
        font: {
          size: 0,
        },
      },
    },
    title: {
      display: true,
      text: props.title,
      margin: {
        left: 100,
      },
      padding: {
        top: 60,
      },
    },
  },
});

watch(amountArr, () => {
  chartData.value.datasets[0].data = amountArr;
  forceRerender.value++;
})


watch(categoryArr, () => {
  chartData.value.labels = categoryArr;
  forceRerender.value++;
})
</script>
<style></style>
