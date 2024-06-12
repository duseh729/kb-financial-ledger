<!-- 통계 페이지 -->
<template>
  <div>
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {{curDate}}
      </button>
      <ul class="dropdown-menu">
        <div @click.stop.prevent class="monthSelector">
          <button class="monthButton" style="float: left;" 
            @click="moveBackward" v-if="curYearIdx != date.length - 1">
            <
          </button>
          <span v-else class="skeleton"></span>
          <span class="monthIndicator">{{ date[curYearIdx]?.year }}</span>
          <button class="monthButton" style="float: right;"  
          @click="moveForward" v-if="curYearIdx != 0">
            >
          </button>
          <span v-else class="skeleton"></span>
        </div>
        <li class="monthElement"v-for="(item, index) in date[curYearIdx]?.month">
          <a class="dropdown-item" @click="select(index)" >{{item}}</a>
        </li>
      </ul>
    </div>

    <div class="wrapper">
      <div class="chartWrapper">
        <MonthlyChart class="monthlyChartWrapper" title="수입" :data="mappedIncome[curDate]" />
        <MonthlyChart class="monthlyChartWrapper" title="지출" :data="mappedExpense[curDate] " />
      </div>
      <div class="detailChartWrapper">
        <DetailChart 
          :prevMonthData="mappedExpense[getPreviousMonth(curDate)]" 
          :curMonthData="mappedExpense[curDate]"
        />
      </div>
    </div>
  </div>

</template>

<script setup>
import axios from "axios";
import { ref, reactive, onMounted } from "vue";

import MonthlyChart from "../components/Statistics/MonthlyChart.vue";
import DetailChart from "../components/Statistics/DetailChart.vue";

const date = reactive([])
const curDate = ref()
const curYearIdx = ref(0);
const curMonthIdx = ref(0);
const mappedIncome = reactive({});
const mappedExpense = reactive({});

onMounted(async() =>{  
  const data = await requestData();
  const {incomeData, expenseData } = classify(data);

  Object.assign(mappedIncome, groupByMonth(incomeData));
  Object.assign(mappedExpense, groupByMonth(expenseData))

  Object.assign(date, groupDataByYearAndMonth(data));
  curDate.value = date[curYearIdx.value]?.year +" "+ date[curYearIdx.value]?.month[curMonthIdx.value]
})

function classify(data) {
  const expenseData = [];
  const incomeData = [];

  data.forEach(item => {
    if (item.type === "expense") {
      expenseData.push(item);
    } else if (item.type === "income") {
      incomeData.push(item);
    }
  });

  return {expenseData, incomeData };
}

const moveBackward = () => {
  if(curYearIdx.value == date.length - 1)
    return;

  curYearIdx.value++
  curMonthIdx.value = 0;
}

const moveForward = () => {
  if(curYearIdx.value == 0)
    return;

  curYearIdx.value--;
  curMonthIdx.value = 0;
}

const select = (idx) => {
  curMonthIdx.value = idx;
  curDate.value = date[curYearIdx.value]?.year +" "+ date[curYearIdx.value]?.month[curMonthIdx.value]
}

const requestData = async () => {
  const response = await axios.get(`http://localhost:3001/data`)
  return response.data;
}


const isValid = (year, month) => {
  return !isNaN(year) && !isNaN(month) && month >= 1 && month <= 12;
};

const groupByMonth = (data) => {
  const groupedData = {};

  data.forEach((item) => {
    const dateParts = item.date.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);
    const day = parseInt(dateParts[2]);

    if(!isValid(year, month)){
      return;
    }

    const yearMonth = `${year}년 ${month}월`;

    if (!groupedData[yearMonth]) {
      groupedData[yearMonth] = [];
    }

    groupedData[yearMonth].push({
      day: day,
      amount: item.amount,
      asset: item.asset,
      category: item.category,
      memo: item.memo
    });
  });

  return groupedData;
};

const groupDataByYearAndMonth = (data) => {
  const result = {};
  data.forEach(item => {
    const dateParts = item.date.split('-');
    const year = parseInt(dateParts[0]);
    const month = parseInt(dateParts[1]);

    if(!isValid(year, month)){
      return;
    }

    if (!result[`${year}년`]) {
      result[`${year}년`] = new Set();
    }
    result[`${year}년`].add(`${month}월`);
  });

  return Object.entries(result).map(([year, months]) => ({
    year,
    month: Array.from(months).sort((a, b) => {
      const monthA = parseInt(a);
      const monthB = parseInt(b);
      return monthB - monthA;
    })
  })).sort((a, b) => {
    const yearA = parseInt(a.year);
    const yearB = parseInt(b.year);
    return yearB - yearA;
  });
};

const getPreviousMonth = (yearMonth) => {
  if(yearMonth == undefined)
    return '';
  const [year, month] = yearMonth.split('년 ').map(part => part.replace('월', '').trim());

  let yearNum = parseInt(year);
  let monthNum = parseInt(month);

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    throw new Error('유효하지 않은 날짜 포맷');
  }

  // 이전 달 계산
  if (monthNum === 1) {
    yearNum -= 1;
    monthNum = 12;
  } else {
    monthNum -= 1;
  }

  return `${yearNum}년 ${monthNum}월`;
}

</script>
<style>
@import url("../assets/css/Statistics/chart.css");
</style>
