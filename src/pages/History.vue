<template>
  <div>
    <div class="month-selector">
      <select id="month" v-model="selectedMonth" @change="filterHistorysByMonth">
        <option v-for="month in months" :key="month.value" :value="month.value">
          {{ month.label }}
        </option>
      </select>
    </div>
  </div>

  <div class="main-container">
    <div class="container-left">
      <div class="summary">
        <table class="summary-table">
          <thead>
            <tr>
              <th class="sb1">전체</th>
              <th>수입</th>
              <th>지출</th>
              <th class="sb2">이체</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="balance">{{ totalBalance }} 원</td>
              <td class="income">{{ formattedTotalIncome }} 원</td>
              <td class="expense">{{ formattedTotalExpense }} 원</td>
              <td class="transfer">{{ formattedTotalTransfer }} 원</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="history-list">
        <table>
          <thead>
            <tr>
              <th class="hb1">날짜</th>
              <th>자산</th>
              <th>분류</th>
              <th>금액</th>
              <th class="hb2">내용</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(history, index) in paginatedHistorys" :key="index">
              <td>{{ history.date }}</td>
              <td>{{ history.asset }}</td>
              <td>{{ history.category }}</td>
              <td :class="history.type">{{ new Intl.NumberFormat().format(history.amount) }} 원</td>
              <td>{{ history.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">이전</button>
          <span>{{ currentPage }} / {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
      </div>
    </div>

    <!-- 날짜 필터링 기능 -->
    <div class="container-right">
      <div class="date-inputs">
        <input type="date" id="startDate" v-model="startDate" @change="filterHistorysByDateRange" />
        <input type="date" id="endDate" v-model="endDate" @change="filterHistorysByDateRange" />
      </div>
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
    for (let month = startMonth; month <= 12; month++) {
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
const startDate = ref('')
const endDate = ref('')

const months = ref(generateMonths())
const historys = ref([])
const filteredHistorys = ref([])

const loadHistorys = async() => {
  try {
    const response = await axios.get('http://localhost:3001/data')
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
  setupPagination()
}


/* 날짜 별 필터링 기능 */
const filterHistorysByDateRange = () => {
  const start = new Date(startDate.value)
  const end = new Date(endDate.value)
  if (start && end) {
    filteredHistorys.value = historys.value.filter(history => {
      const historyDate = new Date(history.date)
      return historyDate >= start && historyDate <= end
    })
  } else if (start) {
    filteredHistorys.value = historys.value.filter(history =>
      new Date(history.date) >= start
    )
  } else if (end) {
    filteredHistorys.value = historys.value.filter(history =>
      new Date(history.date) <= end
    )
  } else {
    filterHistorysByMonth()
  }
  setupPagination()
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

const totalBalance = computed(() => {
  const balance = totalIncome.value - totalExpense.value - totalTransfer.value
  return balance.toLocaleString()
})

const formattedTotalIncome = computed(() => totalIncome.value.toLocaleString())
const formattedTotalExpense = computed(() => totalExpense.value.toLocaleString())
const formattedTotalTransfer = computed(() => totalTransfer.value.toLocaleString())

const currentPage = ref(1)
const perPage = 10

const paginatedHistorys = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return filteredHistorys.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredHistorys.value.length / perPage))

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

const setupPagination = () => {
  currentPage.value = 1
}
</script>

<style scoped>
/* 전체 레이아웃 */
.main-container {
  display: flex;
  justify-content: space-between;
}

.container-left {
  flex: 3;
}

.container-right {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.date-inputs {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.date-inputs input[type="date"] {
  margin: 10px 0;
}

/* 나머지 스타일들 그대로 유지 */
.container {
  margin-left: 50px;
  padding: 0;
}

.month-selector {
  margin-top: 20px;
}

.month-selector select {
  font-size: 22px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  outline: none;
  background-color: #fff;
  text-align: center;
  width: 170px;
  margin-left: 40px;
}

input[type="date"] {
  font-size: 18px;
  border: none;
  border-radius: 5px;
  outline: none;
  background-color: #d8d8d8;
  padding: 5px;
  margin-right: 10px;
  text-align: center;
  width: 160px;
}

/* 요약 테이블 스타일 */
.summary {
  margin-bottom: 20px;
  margin-left: 50px;
  margin-right: 50px;
  flex: 1;
}

.summary-table th.sb1 {
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}

.summary-table th.sb2 {
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}

.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.summary-table th, .summary-table td {
  border: 1px solid #ddd none;
  padding: 5px;
  margin-left: 50px;
  text-align: center;
  background-color: #f8f8f8;
}

.summary-table td {
  font-weight: bold;
}

.summary-table th {
  background-color: #545045;
  color: #fff;
}

/* 내역 테이블 스타일 */
.history-list {
  margin-left: 50px;
  margin-right: 50px;
}

.history-list tbody tr:hover,
.history-list tbody tr:hover td {
  background-color: #f0f0f0 !important;
  cursor: pointer;
  border-radius: 5px;
}

.history-list table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  text-align: center;
}

.history-list th, .history-list td {
  border: 1px solid #ddd none;
  padding: 5px;
  text-align: center;
}

.history-list th {
  background-color: #545045;
  color: #fff;
  font-size: 16px;
}

.history-list th.hb1 {
  border-bottom-left-radius: 5px;
  border-top-left-radius: 5px;
}

.history-list th.hb2 {
  border-bottom-right-radius: 5px;
  border-top-right-radius: 5px;
}

.history-list td {
  background-color: #f1f1f1;
}

.history-list td.date {
  width: 20%;
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

.pagination {
  position: fixed;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  padding: 6px 10px;
  font-size: 14px;
  margin: 0 5px;
  background-color: #3e3e3e;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ddd;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #2c2c2c;
}

.pagination span {
  font-size: 16px;
  margin: 0 10px;
}
</style>