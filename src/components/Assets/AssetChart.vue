<template>
  <div class="container">
    <div class="select-container">
      <select id="selectYear" v-model="selectedYear" @change="updateChart">
        <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
      </select>
    </div>
    <div class="chart-container">
      <canvas id="assetChart"></canvas>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import "chartjs-adapter-date-fns"; // 날짜 어댑터 추가

Chart.register(...registerables);

export default {
  props: {
    assetData: {
      type: Array,
      default: () => [], // 기본값 설정
    },
  },
  data() {
    return {
      selectedYear: null,
      availableYears: [],
      chart: null,
    };
  },
  mounted() {
    this.initYears();
    if (this.availableYears.length > 0) {
      this.selectedYear = this.availableYears[1]; // 초기 선택: 첫 번째 년도
      this.createLineChart();
    } else {
      console.error("유효한 데이터가 없습니다.");
    }
  },
  methods: {
    initYears() {
      // 데이터로부터 사용 가능한 년도 목록 추출
      const years = this.assetData.map(entry => new Date(entry.date).getFullYear());
      this.availableYears = [...new Set(years)]; // 중복 제거
    },
    prepareChartData() {
      if (this.assetData.length === 0) {
        // 자산 데이터가 없는 경우 기본 빈 데이터 생성
        return this.generateEmptyChartData();
      }

      // 선택된 년도의 데이터 필터링
      const filteredData = this.assetData.filter(entry => {
        const entryYear = new Date(entry.date).getFullYear();
        return entryYear === this.selectedYear;
      });
      // console.log(this.assetData)
      // console.log(filteredData)
      // 년도별로 월별 합계 계산
      const monthlyData = {};
      for (let month = 1; month <= 12; month++) {
        monthlyData[month] = 0; // 초기화: 모든 월을 0으로 설정
      }

      // 실제 데이터가 있는 월에 데이터 추가
      filteredData.forEach(entry => {
        const date = new Date(entry.date);
        const month = date.getMonth() + 1; // 월을 1부터 12까지로 맞추기 위해 +1
        // console.log(entry)
        monthlyData[month] = entry.amount;
        // console.log(monthlyData[month])
      });

      // 빈 데이터 생성: 1월부터 12월까지
      const chartData = [];
      let temp = 0
      for (let month = 1; month <= 12; month++) {
        temp += monthlyData[month]
        // console.log(monthlyData[month])
        // console.log(temp)
        chartData.push({
          date: `${this.selectedYear}-${String(month).padStart(2, "0")}`, // "2024-06" 형식의 날짜 문자열
          amount: temp, // 해당 월의 데이터가 없으면 0으로 설정됨
        });
        // console.log(chartData)
      }

      return chartData;
    },
    generateEmptyChartData() {
      // 빈 데이터 생성: 1월부터 12월까지
      const chartData = [];
      for (let month = 1; month <= 12; month++) {
        chartData.push({
          date: `${this.selectedYear}-${String(month).padStart(2, "0")}`, // "2024-06" 형식의 날짜 문자열
          amount: 0,
        });
      }
      return chartData;
    },
    createLineChart() {
      const ctx = document.getElementById("assetChart").getContext("2d");
      const chartData = this.prepareChartData();

      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartData.map(item => item.date),
          datasets: [
            {
              label: "현재자산",
              data: chartData.map(item => item.amount),
              borderColor: "rgb(255, 37, 37)",
              // backgroundColor: 'rgb(255, 169, 169)',
              // fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "month",
                tooltipFormat: "yyyy-MM", // 날짜 형식
              },
              title: {
                display: true,
                text: "날짜",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "누적 금액",
              },
            },
          },
        },
      });
    },
    updateChart() {
      // 새로운 년도로 차트 업데이트
      const ctx = document.getElementById("assetChart").getContext("2d");
      const chartData = this.prepareChartData();

      // 기존 차트 객체 파괴
      if (this.chart) {
        this.chart.destroy();
      }

      // 새로운 차트 생성
      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: chartData.map(item => item.date),
          datasets: [
            {
              label: "현재자산",
              data: chartData.map(item => item.amount),
              borderColor: "rgb(255, 37, 37)",
              // backgroundColor: 'rgb(255, 169, 169)',
              // fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              type: "time",
              time: {
                unit: "month",
                tooltipFormat: "yyyy-MM", // 날짜 형식
              },
              title: {
                display: true,
                text: "날짜",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "누적 금액",
              },
            },
          },
        },
      });
    },
  },
  watch: {
    assetData(newVal) {
      // 데이터 변경 시 가능한 년도 목록 업데이트
      this.initYears();

      // 선택된 년도의 데이터로 차트 업데이트
      if (this.availableYears.length > 0) {
        this.selectedYear = this.availableYears[0]; // 초기 선택: 첫 번째 년도
        this.updateChart();
      } else {
        console.error("유효한 데이터가 없습니다.");
      }
    },
  },
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.select-container {
  margin-bottom: 20px;
  position: absolute;
  top: 4px;
  left: 130px;
}

.chart-container {
  width: 100%;
  height: 300px;
  position: relative;
}
</style>
