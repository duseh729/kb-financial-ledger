<!-- 통계 페이지 -->
<template>
  <div>
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        2024년 6월
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </div>
    <div class="wrapper">
      <div class="chartWrapper">
        <MonthlyChart class="monthlyChartWrapper" :title="수입" />
        <MonthlyChart class="monthlyChartWrapper" :title="지출" />
      </div>
      <div class="detailChartWrapper">
        <DetailChart />
      </div>
    </div>
  </div>
</template>
<script setup>
import MonthlyChart from "../components/Statistics/MonthlyChart.vue";
import DetailChart from "../components/Statistics/DetailChart.vue";
</script>
<style >
@import url("../assets/css/Statistics/chart.css");
</style>
