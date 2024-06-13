<template>
  <div class="container">
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
      type: Object,
      default: () => [], // 기본값 설정
    },
  },
  mounted() {
    console.log(this.assetData);
    if (Array.isArray(this.assetData) && this.assetData.length > 0) {
      this.createLineChart();
    } else {
      console.error("유효한 데이터가 없습니다.");
    }
  },
  methods: {
    createLineChart() {
      const ctx = document.getElementById("assetChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: this.assetData.map(item => item.date),
          datasets: [
            {
              label: "현재자산",
              data: this.assetData.map(item => item.amount),
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
                unit: "day",
                tooltipFormat: "PP", // 날짜 형식
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
};
</script>

<style scoped>
.container {
  padding: 20px;
}

.chart-container {
  width: 100%;
  height: 300px;
  position: relative;

  /* color: rgb(255, 37, 37); */
}
</style>
