<template>
  <div v-if=" Object.keys(groupedData).length > 0"class="container">
    <div class="monthlyChartWrapper">
      <Doughnut id="my-chart-id" :options="chartOptions" :data="chartData" :key="forceRerender"/>
    </div>
    <ChartIndex :title="props.title" :data="props.data"/>
  </div>
  <div v-else>
    <Doughnut id="skeleton-chart" :options="chartOptions" :data="skeletonData" :key="forceRerender"/>
  </div>
</template>
<script setup>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartIndex from "./ChartIndex.vue";
import { ref, toRef, unref, computed, onMounted, watch, reactive } from "vue";
import { getChartColors } from './util/ChartColorPallete';
ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({ title: String, data: Array })
const forceRerender = ref(0);

const groupedData = computed(() => groupByCategory(props.data));
const categoryArr = computed(() => Object.keys(groupedData.value))
const amountArr = computed(() => Object.values(groupedData.value));

const chartData = reactive({
  labels: categoryArr,
  datasets: [
    {
      backgroundColor: [],
      data: amountArr,
    },
  ],
});

const skeletonData = reactive({
  labels: ['없음'],
  datasets: [
    {
      backgroundColor: ['#dee2e6'],
      data: [1],
    },
  ],
});

const chartOptions = reactive({
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

watch(amountArr, () => {
  chartData.datasets[0].data = amountArr;
  forceRerender.value++;
})

watch(categoryArr, () => {
  chartData.labels = categoryArr;
  chartData.datasets[0].backgroundColor = getChartColors(categoryArr.value.length);
  forceRerender.value++;
})


</script>
<style></style>
