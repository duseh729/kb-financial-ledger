<template lang="">
  <div class="calendar-container">
    <div style="margin-bottom: 12px">
      <!-- 이전 달로 이동하는 버튼 -->
      <button class="calendar-move-button" @click="goToPreviousMonth">◀️</button>
      <span>{{ `${year}년 ${month + 1}월` }}</span>
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
              backgroundColor: date[1] ? '#eee' : 'inherit',
            }"
            style="position: relative"
            @click="pickDate({ date: date[0], monthValue: date[2] })"
          >
            <div style="position: absolute; top: 6px; left: 6px">
              <span :class="{ today: isToday(date) }" :style="{ color: dateIndex === 0 ? 'red' : dateIndex === 6 ? 'blue' : 'inherit' }">{{ date[0] }}</span>
            </div>
            <div style="position: absolute; right: 0px; bottom: 0px; text-align: right">
              <!-- 수입과 지출이 있을 때만 수입, 지출 텍스트 디스플레이 -->
              <span v-show="getIncome(date) && !date[1]" :style="`color:red`">+{{ getIncome(date).toLocaleString("ko-KR") }}<br /></span
              ><span v-show="getExpense(date) && !date[1]" :style="`color:blue`">-{{ getExpense(date).toLocaleString("ko-KR") }}<br /></span>
              <span v-show="!date[1] && (getIncome(date) || getExpense(date))">{{ (getIncome(date) - getExpense(date)).toLocaleString("ko-KR") }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch } from "vue";
import { defineProps } from "vue";

// Props 정의
const props = defineProps({
  financialLedgerData: {
    type: Object,
    required: true,
  },
  today: {
    type: Object,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },

  yearChange: {
    type: Function,
    required: true,
  },
  monthChange: {
    type: Function,
    required: true,
  },
  dateChange: {
    type: Function,
    required: true,
  },
});

// 요일을 배열로 정의합니다.
const days = ["일", "월", "화", "수", "목", "금", "토"];

// 달력의 전체 날짜를 출력하는 함수
const getFirstAndLastDate = (month, year) => {
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();
  const lastDay = new Date(year, month + 1, 0).getDay();
  return { firstDay, lastDate, lastDay };
};

// 오늘 날짜인지 확인하는 함수
const isToday = date => {
  return date[0] === props.today.getDate() && props.month === props.today.getMonth() && props.year === props.today.getFullYear();
};

// 이전 달이나 다음 달의 날짜인지 확인하는 함수
const isPrevOrNextMonth = date => {
  const { firstDay, lastDate } = getFirstAndLastDate(props.month, props.year);
  return date < firstDay || date > lastDate;
};

const weeks = ref([]);

// 달력의 전체 날짜를 가져오는 함수.
const getDates = () => {
  const { firstDay, lastDate } = getFirstAndLastDate(props.month, props.year);
  const prevMonthDates = getPrevMonthDates(firstDay);

  for (let i = 0; i < prevMonthDates.length; i++) {
    prevMonthDates[i] = [prevMonthDates[i], true, "prev"];
  }

  const thisMonthDates = getThisMonthDates(lastDate);
  for (let i = 0; i < thisMonthDates.length; i++) {
    thisMonthDates[i] = [thisMonthDates[i], false];
  }

  const nextMonthDates = getNextMonthDates(lastDate);
  for (let i = 0; i < nextMonthDates.length; i++) {
    nextMonthDates[i] = [nextMonthDates[i], true, "next"];
  }

  // 이전 달, 이번 달, 다음 달의 날짜를 합쳐서 하나의 배열로 만듭니다.
  const allDates = prevMonthDates.concat(thisMonthDates, nextMonthDates);

  // 합쳐진 모든 날짜를 7개씩 묶어서 weeks 배열에 넣습니다.
  weeks.value = chunkArray(allDates, 7);
  // console.log(weeks.value)
};

// 주어진 배열을 지정된 크기로 나누는 함수
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

// 이전 달의 날짜를 반환하는 함수
const getPrevMonthDates = firstDay => {
  const prevMonthDates = [];
  const prevMonthLastDate = new Date(props.year, props.month, 0).getDate();
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
  const lastDay = new Date(props.year, props.month + 1, 0).getDay();
  const nextMonthDays = 6 - lastDay;
  for (let date = 1; date <= nextMonthDays; date++) {
    nextMonthDates.push(date);
  }
  return nextMonthDates;
};

// 이전 달로 이동하는 함수
const goToPreviousMonth = () => {
  if (props.month === 0) {
    props.yearChange(props.year - 1);
    props.monthChange(11);
  } else {
    props.monthChange(props.month - 1);
  }
  props.dateChange(1);
  getDates();
};

// 다음 달로 이동하는 함수
const goToNextMonth = () => {
  if (props.month === 11) {
    props.yearChange(props.year + 1);
    props.monthChange(0);
  } else {
    props.monthChange(props.month + 1);
  }
  props.dateChange(1);
  getDates();
};

// 캘린더 날짜 선택 함수
const pickDate = value => {
  // console.log(value)
  if (value.monthValue === "prev") {
    goToPreviousMonth();
  } else if (value.monthValue === "next") {
    goToNextMonth();
  }
  props.dateChange(value.date);
};

onMounted(() => {
  // 달력의 전체 날짜를 출력하는 함수 호출
  getDates();
});

const financialLedgerData = reactive(props.financialLedgerData);

// 캘린더 날짜에 대한 수입을 가져오는 함수
const getIncome = date => {
  // 해당 월에 아무 값도 없으면 리턴
  const year = props.year;
  const month = String(props.month + 1).padStart(2, "0");
  const day = String(date[0]).padStart(2, "0");
  // console.log(income);
  // console.log(year, month, day);
  if (
    date[1] ||
    financialLedgerData[year] === undefined ||
    financialLedgerData[year][month] === undefined ||
    financialLedgerData[year][month][day] === undefined
  ) {
    // console.log(month, day, "데이터없음");
    return false;
  }
  // console.log(financialLedgerData[year][month][day]);
  let sum = 0;
  for (let i of financialLedgerData[year][month][day]) {
    // console.log(i)
    if (i.type === "income") {
      sum += i.amount;
    }
  }
  // console.log(sum);
  return financialLedgerData[year][month][day] !== undefined ? sum : false;
};

// 캘린더 날짜에 대한 지출을 가져오는 함수
const getExpense = date => {
  // console.log(expense.value)
  const year = props.year;
  const month = String(props.month + 1).padStart(2, "0");
  const day = String(date[0]).padStart(2, "0");

  if (
    date[1] ||
    financialLedgerData[year] === undefined ||
    financialLedgerData[year][month] === undefined ||
    financialLedgerData[year][month][day] === undefined
  ) {
    // console.log(month, day, "데이터없음");
    return false;
  }
  // console.log(financialLedgerData[year][month][day]);
  let sum = 0;
  for (let i of financialLedgerData[year][month][day]) {
    // console.log(i)
    if (i.type === "expense") {
      sum += i.amount;
    }
  }
  // console.log(sum);
  return financialLedgerData[year][month][day] !== undefined ? sum : false;
};

// props가 변경될 때마다 getDates 함수 호출
watch(
  () => [props.year, props.month],
  () => {
    getDates();
  }
);
</script>

<style scoped>
@import url("../../assets/css/Calendar/calendar.css");
</style>
