<template>
    <div class="detailChartWrapper">
      <Line id="my-chart-id" :options="chartOptions" :data="chartData" :key="forceRerender"/>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUpdated, reactive } from "vue";
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
const prevChartPoints = reactive([])
const curChartPoints = reactive([])

const chartData = reactive({
  labels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
  datasets: [
    {
      label: "현재 사용량",
      borderColor: "#f87979",
      backgroundColor: "#f87979",
      data: [],
    },
    {
      label: '전월 사용량',
      borderColor: "#OA5C36",
      backgroundColor: "#OA5C36",
      data: [],
    }
  ],
});

const chartOptions = reactive({
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

onUpdated(() =>{
  props.prevMonthData?.sort((o1, o2) => o1.day - o2.day)
  props.curMonthData?.sort((o1, o2) => o1.day - o2.day)
  Object.assign(prevChartPoints, generateAmountUsagePoint(props.prevMonthData))
  Object.assign(curChartPoints, generateAmountUsagePoint(props.curMonthData))
})

const generateAmountUsagePoint = (data) =>{
  let sum = 0;
  let cur = 0;
  const sumArr = [];
  for(let i = 1; i <= 31; i++){
    while(data != undefined && cur < data.length && i == data[cur].day){
      sum += data[cur++].amount;
    }
    sumArr.push(sum)
  }
  return sumArr;
} 

watch(curChartPoints, () => {
  chartData.datasets[0].data = curChartPoints;
  forceRerender.value++;
})

watch(prevChartPoints, () => {
  chartData.datasets[1].data = prevChartPoints;
  forceRerender.value++;
})

</script>
<style></style>
