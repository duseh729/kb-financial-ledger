<template>
  <div class="lineChart">
    <!-- Line 컴포넌트를 사용하여 차트를 렌더링합니다. forceRerender 값을 key로 사용하여 차트를 강제로 다시 렌더링합니다. -->
    <Line id="my-chart-id" :options="chartOptions" :data="chartData" :key="forceRerender"/>
  </div>
</template>

<script setup>
import { ref, watch,  onUpdated, reactive } from "vue";
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

// Chart.js 구성 요소 등록
ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend
);

const props = defineProps({title: String, prevMonthData : Array, curMonthData : Array});
const forceRerender  = ref(0);  // 차트를 강제로 다시 렌더링하는 데 사용되는 키
const prevChartPoints = reactive([]);  // 이전 달 데이터 포인트
const curChartPoints = reactive([]);  // 현재 달 데이터 포인트

const chartData = reactive({
labels: Array.from({ length: 31 }, (_, i) => i + 1), // 날짜 레이블 (1일부터 31일까지)
datasets: [
  {
    label: "현재 사용량",
    borderColor: props.title == "지출" ? "#f87979" : "blue", // 조건에 따라 색상 변경
    backgroundColor: props.title == "지출" ? "#f87979" : "blue",
    data: [], // 현재 달 데이터 초기화
  },
  {
    label: '전월 사용량',
    borderColor: "#OA5C36",
    backgroundColor: "#OA5C36",
    data: [], // 이전 달 데이터 초기화
  }
],
});

const chartOptions = reactive({
responsive: true,
maintainAspectRatio: false,
plugins: {
  legend: {
    labels: {
      font: {
        size: 20 // 범례 글꼴 크기 설정
      }
    },
    position: "right", // 범례 위치 설정
  },
  title: {
    font:{
      size: 20 // 제목 글꼴 크기 설정
    },
    display: true,
    text: `전월 ${props.title} 비교`, // 제목 텍스트 설정
    amrgin: {
      left: 0,
    },
    padding: {
      top: 0,
      bottom: 30,
    },
  },
},
scales: {
  x: {
    ticks: {
      font: {
        size: 20 // X축 눈금 글꼴 크기 설정
      }
    }
  },
  y: {
    ticks: {
      font: {
        size: 20 // Y축 눈금 글꼴 크기 설정
      }
    }
  }
}
});

onUpdated(() => {
// 데이터가 업데이트될 때마다 호출됩니다.
props.prevMonthData?.sort((o1, o2) => o1.day - o2.day); // 이전 달 데이터를 날짜 순으로 정렬
props.curMonthData?.sort((o1, o2) => o1.day - o2.day); // 현재 달 데이터를 날짜 순으로 정렬
Object.assign(prevChartPoints, generateAmountUsagePoint(props.prevMonthData)); // 정렬된 이전 달 데이터를 차트 포인트로 변환
Object.assign(curChartPoints, generateAmountUsagePoint(props.curMonthData)); // 정렬된 현재 달 데이터를 차트 포인트로 변환
});

/**
* 주어진 데이터를 일별 누적 사용량 포인트로 변환하는 함수
* @param {Array} data - 일별 사용량 데이터
* @returns {Array} 일별 누적 사용량 포인트
*/
const generateAmountUsagePoint = (data) => {
let sum = 0; // 누적 사용량
let cur = 0; // 현재 데이터 인덱스
const sumArr = []; // 일별 누적 사용량을 저장할 배열
for (let i = 1; i <= 31; i++) { // 1일부터 31일까지 반복
  while (data != undefined && cur < data.length && i == data[cur].day) { // 현재 날짜에 해당하는 데이터를 찾음
    sum += data[cur++].amount; // 해당 날짜의 사용량을 누적
  }
  sumArr.push(sum); // 누적 사용량을 배열에 추가
}
return sumArr; // 일별 누적 사용량 배열 반환
} 

// 현재 달 데이터 포인트가 변경될 때마다 차트 데이터를 업데이트하고 차트를 다시 렌더링
watch(curChartPoints, () => {
chartData.datasets[0].data = curChartPoints;
forceRerender.value++;
});

// 이전 달 데이터 포인트가 변경될 때마다 차트 데이터를 업데이트하고 차트를 다시 렌더링
watch(prevChartPoints, () => {
chartData.datasets[1].data = prevChartPoints;
forceRerender.value++;
});

</script>
<style></style>
