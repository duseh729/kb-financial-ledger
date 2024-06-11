<template lang="">
  <div>
    <div style="margin-bottom: 12px;">
      <!-- 이전 달로 이동하는 버튼 -->
      <button class="calendar-move-button" @click="goToPreviousMonth">◀️</button>
      <span>{{`${year}년 ${month+1}월`}}</span>
      <!-- 다음 달로 이동하는 버튼 -->
      <button class="calendar-move-button" @click="goToNextMonth">▶️</button>
    </div>
    <table class="">
      <thead>
        <tr>
          <th scope="col" v-for="(day, index) in days" :key="day" class="day" :style="{ color: index === 0 ? 'red' : index === 6 ? 'blue' : 'inherit' }">
            {{ day }}
          </th>
          <!-- 요일 출력 -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, weekIndex) in weeks" :key="weekIndex">
          <td
            v-for="(date, dateIndex) in week"
            :key="dateIndex"
            :class="{ today: isToday(date), 'prev-or-next-month': isPrevOrNextMonth(date) }"
            class="date"
            :style="{
              color: dateIndex === 0 ? 'red' : dateIndex === 6 ? 'blue' : 'inherit',
              backgroundColor: date[1] ? '#eee' : 'inherit',
            }"
          >
            <span :class="{ today: isToday(date) }">{{ date[0] }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";

// 현재 날짜를 가져오는 변수를 정의합니다.
const today = new Date();

// year, month, date를 ref로 정의합니다.
const year = ref(today.getFullYear());
const month = ref(today.getMonth());

// 요일을 배열로 정의합니다.
const days = ["일", "월", "화", "수", "목", "금", "토"];

// 달력의 전체 날짜를 출력하는 함수를 정의합니다.
const getFirstAndLastDate = (month, year) => {
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const lastDay = new Date(year, month + 1, 0).getDay();
  return { firstDay, lastDate, lastDay };
};

// 오늘 날짜인지 확인하는 함수
const isToday = date => {
  // console.log(date[0])
  return date[0] === today.getDate() && month.value === today.getMonth() && year.value === today.getFullYear();
};

// 이전 달이나 다음 달의 날짜인지 확인하는 함수
const isPrevOrNextMonth = date => {
  const { firstDay, lastDate } = getFirstAndLastDate(month.value, year.value);
  return date < firstDay || date > lastDate;
};

// weeks 배열을 정의합니다.
const weeks = ref([]);

// 달력의 전체 날짜를 가져오는 함수를 정의합니다.
const getDates = () => {
  const { firstDay, lastDate } = getFirstAndLastDate(month.value, year.value);
  const prevMonthDates = getPrevMonthDates(firstDay);

  for (let i = 0; i < prevMonthDates.length; i++) {
    prevMonthDates[i] = [prevMonthDates[i], true];
  }
  // console.log(prevMonthDates)

  const thisMonthDates = getThisMonthDates(lastDate);
  for (let i = 0; i < thisMonthDates.length; i++) {
    thisMonthDates[i] = [thisMonthDates[i], false];
  }

  const nextMonthDates = getNextMonthDates(lastDate);
  for (let i = 0; i < nextMonthDates.length; i++) {
    nextMonthDates[i] = [nextMonthDates[i], true];
  }

  // 이전 달, 이번 달, 다음 달의 날짜를 합쳐서 하나의 배열로 만듭니다.
  const allDates = prevMonthDates.concat(thisMonthDates, nextMonthDates);

  // 합쳐진 모든 날짜를 7개씩 묶어서 weeks 배열에 넣습니다.
  weeks.value = chunkArray(allDates, 7);
};

// 주어진 배열을 지정된 크기로 나누는 함수
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  // console.log("chunks??", chunks)
  return chunks;
};

// 이전 달의 날짜를 반환하는 함수
const getPrevMonthDates = firstDay => {
  const prevMonthDates = [];
  const prevMonthLastDate = new Date(year.value, month.value, 0).getDate();
  const prevMonthStartDay = prevMonthLastDate - firstDay + 1;
  for (let date = prevMonthStartDay; date <= prevMonthLastDate; date++) {
    prevMonthDates.push(date);
  }
  return prevMonthDates;
};

// 현재 달의 날짜를 반환하는 함수
const getThisMonthDates = lastDate => {
  const thisMonthDates = [];
  for (let date = 1; date <= lastDate; date++) {
    thisMonthDates.push(date);
  }
  return thisMonthDates;
};

// 다음 달의 날짜를 반환하는 함수
const getNextMonthDates = lastDate => {
  const nextMonthDates = [];
  const lastDay = new Date(year.value, month.value + 1, 0).getDay();
  const nextMonthDays = 6 - lastDay;
  for (let date = 1; date <= nextMonthDays; date++) {
    nextMonthDates.push(date);
  }
  return nextMonthDates;
};

// 이전 달로 이동하는 함수
const goToPreviousMonth = () => {
  if (month.value === 0) {
    year.value--;
    month.value = 11;
  } else {
    month.value--;
  }
  getDates();
};

// 다음 달로 이동하는 함수
const goToNextMonth = () => {
  if (month.value === 11) {
    year.value++;
    month.value = 0;
  } else {
    month.value++;
  }
  getDates();
};

onMounted(() => {
  // 달력의 전체 날짜를 출력하는 함수 호출
  getDates();
});
</script>
<style>
@import url("../../assets/css/Calendar/calendar.css");
</style>
