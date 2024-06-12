<template>
    <Line id="my-chart-id" :options="chartOptions" :data="chartData" :key="forceRerender"/>
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue";
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

const props = defineProps({prevMonthData : Array, curMonthData : Array})
const forceRerender  = ref(0);
const prevChartPoints = ref([])
const curChartPoints = ref([])
onMounted( async() =>{
  props.prevMonthData.sort((o1, o2) => o1.day - o2.day)
  props.curMonthData.sort((o1, o2) => o1.day - o2.day)
  
})

watch(props.curMonth, () => {
  chartData.value.datasets[0].data = props.curMonth;
  forceRerender.value++;
})

watch(props.prevMonth, () => {
  chartData.value.datasets[1].data = props.prevMonth;
  forceRerender.value++;
})

const chartData = ref({
  labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
  datasets: [
    {
      label: "현재 사용량",
      borderColor: "#f87979",
      backgroundColor: "#f87979",
      //날짜값
      data: [40, 39, 10, 40, 39, 80, 40, 10, 11,1,1,1,1,1,1,1,1,1],
    },
    {
      label: '전월 사용량',
      data: [10, 20, 30, 40, 50, 80, 40, 10, 11,1,1,1,1,1,1,1,1,1],
      borderColor: "#OA5C36",
      backgroundColor: "#OA5C36",
      yAxisID: 'y1',
    }
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
      text: "전월 지출 비교",
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
