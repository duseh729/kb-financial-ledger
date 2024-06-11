<!-- 달력 페이지 -->
<template>
  <div style="padding: 50px">
    <div style="display: flex; gap: 18px">
      <Calendar :today="today" :year="year" :month="month" :date="date" :yearChange="yearChange" :monthChange="monthChange" :dateChange="dateChange" />
      <div style="position: relative; top: 39px">
        <AssetStatus />
        <MemoForm :year="year" :month="month" :date="date" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Calendar from "../components/Calendar/Calendar.vue";
import AssetStatus from "../components/Calendar/AssetStatus.vue";
import MemoForm from "../components/Calendar/MemoForm.vue";

import { ref } from "vue";

// 현재 날짜를 가져오는 변수를 정의합니다.
const today = new Date();
// console.log(today)
// year, month, date를 ref로 정의합니다.
const year = ref(today.getFullYear());
const month = ref(today.getMonth());
const date = ref(today.getDate());

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
</script>

<style scoped></style>
