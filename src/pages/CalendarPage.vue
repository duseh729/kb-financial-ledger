<!-- 달력 페이지 -->
<template>
  <div style="padding: 50px">
    <div style="display: flex; gap: 18px">
      <Calendar :financialLedgerData="financialLedgerData" :today="today" :year="year" :month="month" :date="date" :yearChange="yearChange" :monthChange="monthChange" :dateChange="dateChange" />
      <div style="position: relative; top: 39px">
        <AssetStatus :financialLedgerData="financialLedgerData" :year="year" :month="month" />
        <MemoForm :year="year" :month="month" :date="date" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Calendar from "../components/Calendar/Calendar.vue";
import AssetStatus from "../components/Calendar/AssetStatus.vue";
import MemoForm from "../components/Calendar/MemoForm.vue";

import { computed, onMounted, ref } from "vue";
import axios from "axios";

// 현재 날짜를 가져오는 변수를 정의합니다.
const today = new Date();
// console.log(today)
// year, month, date를 ref로 정의합니다.
const year = ref(today.getFullYear());
const month = ref(today.getMonth());
const date = ref(today.getDate());

const financialLedgerData = ref({});

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
  const response = await axios.get("http://localhost:3001/temp");
  for (let i of response.data) {
    // console.log(i) // amount: 4000000, asset: "은행", category: "월급", date: "2024-04-10", description: "월급", type: "income"
    const dateTemp = i.date.split("-");
    const { amount, asset, category, description, type } = i;
    // console.log(amount, asset, category, description, type)
    if (!financialLedgerData.value[dateTemp[0]]) {
      financialLedgerData.value[dateTemp[0]] = {};
    }
    if(!financialLedgerData.value[dateTemp[0]][dateTemp[1]]){
      financialLedgerData.value[dateTemp[0]][dateTemp[1]]={}
    }

    if (!financialLedgerData.value[dateTemp[0]][dateTemp[1]][dateTemp[2]]) {
      financialLedgerData.value[dateTemp[0]][dateTemp[1]][dateTemp[2]] = { amount, asset, category, description, type };
    } else {
      financialLedgerData.value[dateTemp[0]][dateTemp[1]][dateTemp[2]] = {
        ...financialLedgerData.value[dateTemp[0]][dateTemp[1]][dateTemp[2]],
        amount,
        asset,
        category,
        description,
        type,
      };
    }
  }
  // console.log(financialLedgerData.value);
});

</script>

<style scoped></style>
