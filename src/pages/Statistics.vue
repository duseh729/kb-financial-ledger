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
        <MonthlyChart class="monthlyChartWrapper" title="지출" :data="mappedExpense[curDate]" />
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
import MonthlyChart from "../components/Statistics/MonthlyChart.vue";
import DetailChart from "../components/Statistics/DetailChart.vue";
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";

const income = ref([])
const expense = ref([])
const curYearIdx = ref(0);
const curMonthIdx = ref(0);
const mappedIncome = ref({});
const mappedExpense = ref({});
const date = ref([])
const curDate = ref()
onMounted(async() =>{  
  income.value = await requestData("income");
  expense.value = await requestData("expense");
  mappedIncome.value = groupByMonth(income.value);
  mappedExpense.value  = groupByMonth(expense.value);
  const mergedArr = [...income.value, ...expense.value]
  date.value = await groupDataByYearAndMonth(mergedArr);
  curDate.value = date.value[curYearIdx.value]?.year +" "+ date.value[curYearIdx.value]?.month[curMonthIdx.value]
})

const moveBackward = () => {
  if(curYearIdx.value == date.value.length - 1)
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
  curDate.value = date.value[curYearIdx.value]?.year +" "+ date.value[curYearIdx.value]?.month[curMonthIdx.value]

}

const requestData = async (api) => {
  const response = await axios.get(`http://localhost:3001/${api}`)
  return response.data;
}

const isValid = (year, month) => {
  if(isNaN(year) || isNaN(month))
      return false;
  return true;
}

const groupByMonth = (data) => {
  const groupedData = {};

  data.forEach((item) => {
    const date = new Date(parseInt(item.date));
    if(!isValid(date.getFullYear(), date.getMonth()))
      return;
    const yearMonth = `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    const day = date.getDate();


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

const groupDataByYearAndMonth = async (data) => {
  const result = {};
  data.forEach(item => {
    const date = new Date(parseInt(item.date));
    if(!isValid(date.getFullYear(), date.getMonth()))
      return;
    const year = `${date.getFullYear()}년`;
    const month = `${date.getMonth() + 1}월`;

    if (!result[year]) {
      result[year] = new Set();
    }
    result[year].add(month);
  });

  return Object.entries(result).map(([year, months]) => ({
    year,
    month: Array.from(months).sort((a, b) => {
      const monthA = parseInt(a);
      const monthB = parseInt(b);
      return monthB - monthA;
    })
  }));
};

const formatDate = (unixTimestamp) => {
  const date = new Date(Number(unixTimestamp));
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  return `${year}/${month}/${day}`;
};

const formattedData = computed(() => {
  return income.value.map(item => ({
    ...item,
    date: formatDate(item.date)
  }));
});

const getPreviousMonth = (yearMonth) => {
  if(yearMonth == undefined)
    return '';
  const [year, month] = yearMonth.split('년 ').map(part => part.replace('월', '').trim());

  let yearNum = parseInt(year);
  let monthNum = parseInt(month);

  if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
    throw new Error('Invalid input format. Expected format: "YYYY년 M월".');
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
