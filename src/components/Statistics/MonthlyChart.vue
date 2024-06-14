<template>
  <div class="doughnutChartWrapper" v-if="Object.keys(groupedData).length > 0">
    <div class="doughnutChart">
      <!-- Doughnut 컴포넌트를 사용하여 차트를 렌더링합니다. forceRerender 값을 key로 사용하여 차트를 강제로 다시 렌더링합니다. -->
      <Doughnut id="my-chart-id" :options="chartOptions" :data="chartData" :key="forceRerender"/>
    </div>
    <!-- ChartIndex 컴포넌트에 데이터를 전달합니다. -->
    <ChartIndex :title="props.title" :data="groupedData"/>
  </div>
  <div class="doughnutChartWrapper" v-else>
    <div class="doughnutChart">
      <!-- 데이터가 없을 때 skeleton chart를 표시합니다. -->
      <Doughnut id="skeleton-chart" :options="chartOptions" :data="skeletonData" :key="forceRerender"/>
    </div>
    <!-- ChartIndex 컴포넌트에 데이터를 전달합니다. -->
    <ChartIndex :title="props.title" :data="groupedData"/>
  </div>
</template>

<script setup>
import { Doughnut } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartIndex from "./ChartIndex.vue";
import { ref, toRef, unref, computed, onMounted, watch, reactive } from "vue";
import { getChartColors } from './util/ChartColorPallete';

// Chart.js 구성 요소 등록
ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({ title: String, data: Array });
const forceRerender = ref(0); // 차트를 강제로 다시 렌더링하는 데 사용되는 키

// 데이터를 카테고리별로 그룹화하여 계산
const groupedData = computed(() => groupByCategory(props.data));
// 그룹화된 카테고리 배열
const categoryArr = computed(() => Object.keys(groupedData.value));
// 그룹화된 금액 배열
const amountArr = computed(() => Object.values(groupedData.value));

// 실제 차트 데이터
const chartData = reactive({
  labels: categoryArr,
  datasets: [
    {
      backgroundColor: [],
      data: amountArr,
    },
  ],
});

// 데이터가 없을 때 표시할 skeleton 데이터
const skeletonData = reactive({
  labels: ['없음'],
  datasets: [
    {
      backgroundColor: ['#dee2e6'],
      data: [1],
    },
  ],
});

// 차트 옵션 설정
const chartOptions = reactive({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: {
          size: 0, // 범례 글꼴 크기 설정
        },
      },
    },
    title: {
      display: true,
      text: props.title, // 차트 제목 설정
      font: {
        size: 20,
        weight: 'bold',
      },
      padding: {
        top: 30,
      },
    },
  },
});

/**
 * 주어진 데이터를 카테고리별로 그룹화하는 함수
 * @param {Array} data - 그룹화할 데이터 배열
 * @returns {Object} 카테고리별로 그룹화된 데이터
 */
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

// amountArr가 변경될 때마다 차트 데이터를 업데이트하고 차트를 다시 렌더링
watch(amountArr, () => {
  chartData.datasets[0].data = amountArr;
  forceRerender.value++;
});

// categoryArr가 변경될 때마다 차트 레이블 및 배경색을 업데이트하고 차트를 다시 렌더링
watch(categoryArr, () => {
  chartData.labels = categoryArr;
  chartData.datasets[0].backgroundColor = getChartColors(categoryArr.value.length);
  forceRerender.value++;
});
</script>
<style></style>
