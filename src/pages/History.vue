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
        <table class="summary-table" style="table-layout: fixed;">
          <thead>
            <tr>
              <th class="sb1">전체</th>
              <th>수입</th>
              <th class="sb2">지출</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="balance">{{ totalBalance }} 원</td>
              <td class="income">{{ formattedTotalIncome }} 원</td>
              <td class="expense">{{ formattedTotalExpense }} 원</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="history-list">
        <table>
          <thead>
            <tr>
              <th class="hb1" width="7%">선택</th>
              <th width="15%">날짜</th>
              <th width="10%">자산</th>
              <th width="15%">분류</th>
              <th width="20%">금액</th>
              <th class="hb2" width="35%">내용</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(history, index) in paginatedHistorys" :key="index">
              <td><input type="checkbox" v-model="selectedHistorys" :value="history.id" /></td>
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

    <div class="container-right">
      <div class="date-inputs">
        <input type="date" id="startDate" v-model="startDate" @change="filterHistorysByDateRange" />
        <input type="date" id="endDate" v-model="endDate" @change="filterHistorysByDateRange" />
      </div>

      <div class="filters">
        <select v-model="selectedAsset" id="selectedAsset" @change="filterHistorysByFilters">
          <option value="">자산 선택</option>
          <option value="카드">카드</option>
          <option value="은행">은행</option>
          <option value="현금">현금</option>
        </select>
        
        <select v-model="selectedCategory" id="selectedCategory" @change="filterHistorysByFilters">
          <option value="">분류 선택</option>
          <option value="식비">식비</option>
          <option value="월급">월급</option>
          <option value="쇼핑">쇼핑</option>
          <option value="교육비">교육비</option>
          <option value="교통비">교통비</option>
        </select>
      </div>

      <input type="text" v-model="selectedDescription" placeholder="내용 입력" @input="filterHistorysByFilters" class="input-description" />

      <button @click="deleteSelectedHistorys" class="delete-button">삭제</button>
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
const selectedHistorys = ref([]) // Store selected history IDs

const selectedAsset = ref('')
const selectedCategory = ref('')
const selectedDescription = ref('')

const loadHistorys = async() => {
  try {
    const response = await axios.get('http://localhost:3001/data')
    historys.value = response.data.sort((a, b) => new Date(a.date) - new Date(b.date))
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

const filterHistorysByFilters = () => {
  filterHistorysByDateRange()

  if (selectedAsset.value) {
    filteredHistorys.value = filteredHistorys.value.filter(history =>
      history.asset === selectedAsset.value
    )
  }
  if (selectedCategory.value) {
    filteredHistorys.value = filteredHistorys.value.filter(history =>
      history.category === selectedCategory.value
    )
  }
  if (selectedDescription.value) {
    filteredHistorys.value = filteredHistorys.value.filter(history =>
      history.description.includes(selectedDescription.value)
    )
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

const totalBalance = computed(() => {
  const balance = totalIncome.value - totalExpense.value
  return balance.toLocaleString()
})

const formattedTotalIncome = computed(() => totalIncome.value.toLocaleString())
const formattedTotalExpense = computed(() => totalExpense.value.toLocaleString())

const currentPage = ref(1)
const perPage = 13

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

/* 삭제 기능 시스템 */
const deleteSelectedHistorys = async() => {
  if (selectedHistorys.value.length === 0) {
    alert('선택된 항목이 없습니다.')
    return
  }

  try {
    await Promise.all(
      selectedHistorys.value.map(async id => {
        await axios.delete(`http://localhost:3001/data/${id}`)
      })
    )
    alert('선택된 항목이 삭제되었습니다.')
    selectedHistorys.value = [] 
    loadHistorys()
  } catch(error) {
    console.error('Error deleting historys:', error)
    alert('항목 삭제에 실패했습니다.')
  }
}
</script>


<style scoped>
@import url("../assets/css/History/history-month-selector.css");
@import url("../assets/css/History/history-container-right.css");
@import url("../assets/css/History/history-container-left.css");
@import url("../assets/css/History/history-pagination.css");
@import url("../assets/css/History/history.css");
</style>