<!-- 달력 페이지 -->
<template>
  <div>
    <div style="display: flex; gap: 18px" v-if="dataLoaded">
      <Calendar
        :financialLedgerData="financialLedgerData"
        :today="today"
        :year="year"
        :month="month"
        :date="date"
        :yearChange="yearChange"
        :monthChange="monthChange"
        :dateChange="dateChange"
      />
      <div style="position: relative; top: 39px">
        <AssetStatus :financialLedgerData="financialLedgerData" :year="year" :month="month" />
        <MemoForm :year="year" :month="month" :date="date" :financialLedgerData="financialLedgerData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Calendar from "../components/Calendar/Calendar.vue";
import AssetStatus from "../components/Calendar/AssetStatus.vue";
import MemoForm from "../components/Calendar/MemoForm.vue";

import { computed, onMounted, reactive, ref } from "vue";
import axios from "axios";

// 현재 날짜를 가져오는 변수를 정의합니다.
const today = new Date();
// console.log(today)
// year, month, date를 ref로 정의합니다.
const year = ref(today.getFullYear());
const month = ref(today.getMonth());
const date = ref(today.getDate());

const financialLedgerData = reactive({});
const dataLoaded = ref(false);

const yearChange = value => {
  year.value = value;
  // console.log(year.value)
};
const monthChange = value => {
  month.value = value;
  // console.log(month.value)
};
const dateChange = value => {
  // console.log(value);
  date.value = value;
};

onMounted(async () => {
  const response = await axios.get("http://localhost:3001/data");
  for (let i of response.data) {
    const dateTemp = i.date.split("-");
    const { amount, asset, category, description, type } = i;
    const year = dateTemp[0];
    const month = dateTemp[1];
    const day = dateTemp[2];

    if (!financialLedgerData[year]) {
      financialLedgerData[year] = {};
    }
    if (!financialLedgerData[year][month]) {
      financialLedgerData[year][month] = {};
    }
    if (!financialLedgerData[year][month][day]) {
      financialLedgerData[year][month][day] = [];
    }

    financialLedgerData[year][month][day].push({ amount, asset, category, description, type });
  }
  // console.log(financialLedgerData)
  dataLoaded.value = true; // 데이터 로드 완료
});
</script>

<style scoped></style>
