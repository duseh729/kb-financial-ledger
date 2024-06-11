<!-- 내역 페이지 -->
<template lang="">
  <div>
    <div class="month-selector">
      <label for="month">월 선택:</label>
      <select id="month" v-model="selectedMonth" @change="filterTransactionsByMonth">
        <option v-for="month in months" :key="month.value" :value="month.value">
          {{ month.label }}
        </option>
      </select>
    </div>

    <div class="summary">
      <table class="summary-table">
        <thead>
          <tr>
            <th>전체</th>
            <th>수입</th>
            <th>지출</th>
            <th>이체</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="balance">{{ totalBalance }} 원</td>
            <td class="income">{{ totalIncome }} 원</td>
            <td class="expense">{{ totalExpense }} 원</td>
            <td class="transfer">{{ totalTransfer }} 원</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="history-list">
      <table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>자산</th>
            <th>분류</th>
            <th>금액</th>
            <th>내용</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(history, index) in historys" :key="index">
            <td>{{ history.date }}</td>
            <td>{{ history.asset }}</td>
            <td>{{ history.category }}</td>
            <td :class="history.type">{{ history.amount }} 원</td>
            <td>{{ history.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const getCurrentMonth = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

const generateMonths = () => {
  const currentDate = new Date()
  const startYear = 2023
  const startMonth = 1
  const monthsArray = []

  for (let year = startYear; year <= currentDate.getFullYear(); year++) {
    for (let month = 1; month <= 12; month++) {
      if (year === currentDate.getFullYear() && month > currentDate.getMonth() + 1) {
        break;
      }
      const formattedMonth = String(month).padStart(2, '0');
      monthsArray.push({
        value: `${year}-${formattedMonth}`,
        label: `${year}년 ${formattedMonth}월`
      });
    }
  }
  return monthsArray
}

const selectedMonth = ref(getCurrentMonth())
const months = ref(generateMonths())
const historys = ref([])
const filteredHistorys = ref([])

const loadHistorys = async() => {
  try {
    const response = await axios.get('/db-server/data.json')
    historys.value = response.data
    filterHistorysByMonth()
  } catch(error) {
    console.error('Error loading historys:', error)
  }
}

const filterHistorysByMonth = () => {
  filteredHistorys.value = historys.value.filter(history =>
    history.date.startsWith(selectedMonth.value)
  )
}

onMounted(() => {
  loadHistorys()
})

const totalIncome = computed(() =>
  filteredHistorys.value
    .filter((history) => history.type === 'income')
    .reduce((total, history) => total + history.amount, 0)
)

const totalExpense = computed(() => 
  filteredHistorys.value
    .filter((history) => history.type === 'expense')
    .reduce((total, history) => total + history.amount, 0)
)

const totalTransfer = computed(() =>
  filteredHistorys.value
    .filter((history) => history.type === 'transfer')
    .reduce((total, history) => total + history.amount, 0)
)

const totalBalance = computed(() => totalIncome.value - totalExpense.value - totalTransfer.value)
</script>

<style scoped>
.tracker {
  width: 80%;
  margin: 0 auto;
  background-color: #f8f8f8;
  padding: 50px;
  border-radius: 10px;
}

.month-selector {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.month-selector label {
  margin-right: 10px;
  font-weight: bold;
}

.month-selector select {
  padding: 5px;
  font-size: 16px;
}

/* 요약 테이블 스타일 */
.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}
.summary-table th, .summary-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: center;
  background-color: #f8f8f8;
}
.summary-table th {
  background-color: #3e3e3e;
  color: #fff;
}
.summary-table td.positive {
  color: green;
  font-weight: bold;
}
.summary-table td.negative {
  color: red;
  font-weight: bold;
}

/* 내역 테이블 스타일 */
.history-list table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.history-list th, .history-list td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}
.history-list th {
  background-color: #3e3e3e;
  color: #fff;
}

.history-list .expense, .summary-table td.expense {
  color: red;
}

.history-list .income, .summary-table td.income {
  color: blue;
}

.history-list .transfer, .summary-table td.transfer {
  color: green;
}

</style>