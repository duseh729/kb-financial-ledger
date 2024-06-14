<template>
  <div>
    <div class="month-selector">
      <!-- 월 선택 드롭다운 메뉴 -->
      <select id="month" v-model="selectedMonth" @change="filterHistorysByMonth">
        <option v-for="month in months" :key="month.value" :value="month.value">
          {{ month.label }}
        </option>
      </select>
    </div>
  </div>

  <div class="main-container">
    <div class="container-left">
      <!-- 요약 정보 표시 -->
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

      <!-- 내역 리스트 -->
      <div class="history-list">
        <table>
          <thead>
            <tr>
              <th class="hb1" width="20%">날짜</th>
              <th width="10%">자산</th>
              <th width="15%">분류</th>
              <th width="20%">금액</th>
              <th class="hb2" width="35%">내용</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(history, index) in paginatedHistorys" 
              :key="index" 
              @click="selectHistory(history)"
              :class="{ selected: selectedHistory && selectedHistory.id === history.id }" >
              <td>{{ history.date }}</td>
              <td>{{ history.asset }}</td>
              <td>{{ history.category }}</td>
              <td :class="history.type">{{ new Intl.NumberFormat().format(history.amount) }} 원</td>
              <td>{{ history.description }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이지네이션 -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">이전</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">다음</button>
      </div>
    </div>

    <div class="container-right">
      <!-- 날짜 필터 입력 -->
      <div class="date-inputs">
        <input type="date" id="startDate" v-model="startDate" @change="filterHistorysByDateRange" />
        <input type="date" id="endDate" v-model="endDate" @change="filterHistorysByDateRange" />
      </div>

      <!-- 필터 입력 -->
      <div class="filters">
        <select v-model="selectedAsset" id="selectedAsset" @change="filterHistorysByFilters">
          <option value="">자산 선택</option>
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

      <!-- 선택된 내역의 상세 정보 -->
      <div v-if="selectedHistory" class="detail-container">
        <h2>내역 상세</h2>
        <div class="detail-inputs">
          <label>날짜</label><br>
          <input type="date" v-model="selectedHistory.date" id="detail-date" />

          <div class="detail-category-name">
            <label id="asset-name">자산</label>
            <label id="category-name">분류</label>
          </div>

          <div class="detail-inputs-asset-category">
            <select v-model="selectedHistory.asset" id="detailAsset">
              <option value="은행">은행</option>
              <option value="현금">현금</option>
            </select>
            <select v-model="selectedHistory.category" id="detailCategory">
              <option value="식비">식비</option>
              <option value="월급">월급</option>
              <option value="쇼핑">쇼핑</option>
              <option value="교육비">교육비</option>
              <option value="교통비">교통비</option>
              <option value="기타">기타</option>
            </select>
          </div>
          <label>금액</label>
          <input type="number" v-model="selectedHistory.amount" />
          <label>내용</label>
          <input type="text" v-model="selectedHistory.description" />

          <div class="detail-button">
            <button @click="saveChanges" id="detailSave">저장</button>
            <button @click="deleteSelectedHistory" id="detailDelete">삭제</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

/**
 * @brief 현재 월을 'YYYY-MM' 형식으로 반환하는 함수
 * @returns {string} 현재 월
 */
const getCurrentMonth = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

/**
 * @brief 2023년부터 현재 날짜까지의 월 목록을 생성하는 함수
 * @returns {Array} 월 목록
 */
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

// 상태 변수 선언
const selectedMonth = ref(getCurrentMonth())
const startDate = ref('')
const endDate = ref('')

const months = ref(generateMonths())
const historys = ref([])
const filteredHistorys = ref([])
const selectedHistorys = ref([]) // 선택된 내역 ID 저장
const selectedHistory = ref(null) // 선택된 내역 저장

const selectedAsset = ref('')
const selectedCategory = ref('')
const selectedDescription = ref('')

/**
 * @brief 서버에서 내역 데이터를 로드하는 함수
 */
const loadHistorys = async () => {
  try {
    const response = await axios.get('http://localhost:3001/data')
    historys.value = response.data.sort((a, b) => new Date(a.date) - new Date(b.date))
    filterHistorysByMonth()
  } catch (error) {
    console.error('Error loading historys:', error)
  }
}

/**
 * @brief 선택된 월에 따라 내역을 필터링하는 함수
 */
const filterHistorysByMonth = () => {
  filteredHistorys.value = historys.value.filter(history =>
    history.date.startsWith(selectedMonth.value)
  )
  setupPagination()
}

/**
 * @brief 선택된 날짜 범위에 따라 내역을 필터링하는 함수
 */
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

/**
 * @brief 선택된 자산, 카테고리, 내용에 따라 내역을 필터링하는 함수
 */
const filterHistorysByFilters = () => {
  filteredHistorys.value = historys.value
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

// 컴포넌트가 마운트될 때 내역 로드
onMounted(() => {
  loadHistorys()
})

// 계산된 수입 합계
const totalIncome = computed(() =>
  filteredHistorys.value
    .filter((history) => history.type === 'income')
    .reduce((total, history) => total + history.amount, 0)
)

// 계산된 지출 합계
const totalExpense = computed(() => 
  filteredHistorys.value
    .filter((history) => history.type === 'expense')
    .reduce((total, history) => total + history.amount, 0)
)

// 총 잔액 계산
const totalBalance = computed(() => {
  const balance = totalIncome.value - totalExpense.value
  return balance.toLocaleString()
})

const formattedTotalIncome = computed(() => totalIncome.value.toLocaleString())
const formattedTotalExpense = computed(() => totalExpense.value.toLocaleString())

const currentPage = ref(1)
const perPage = 13

// 페이지네이션된 내역
const paginatedHistorys = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return filteredHistorys.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredHistorys.value.length / perPage))

// 이전 페이지로 이동
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1
  }
}

// 다음 페이지로 이동
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1
  }
}

// 페이지네이션 설정
const setupPagination = () => {
  currentPage.value = 1
}

/**
 * @brief 선택된 내역을 삭제하는 함수
 */
const deleteSelectedHistory = async () => {
  if (selectedHistory.value) {
    try {
      await axios.delete(`http://localhost:3001/data/${selectedHistory.value.id}`)
      alert('선택된 항목이 삭제되었습니다.');
      selectedHistorys.value = selectedHistorys.value.filter(id => id !== selectedHistory.value.id)
      selectedHistory.value = null;
      loadHistorys();

    } catch (error) {
      console.error('Error deleting history:', error)
      alert('항목 삭제에 실패했습니다.')
    }
  }
}

/**
 * @brief 내역 선택 시 호출되는 함수
 * @param {Object} history 선택된 내역
 */
const selectHistory = (history) => {
  selectedHistory.value = { ...history } 
}

/**
 * @brief 변경 사항을 저장하는 함수
 */
const saveChanges = async () => {
  if (selectedHistory.value) {
    try {
      await axios.put(`http://localhost:3001/data/${selectedHistory.value.id}`, selectedHistory.value);
      alert('변경 사항이 저장되었습니다.')
      loadHistorys();
    } catch (error) {
      console.error('Error saving changes:', error)
      alert('변경 사항 저장에 실패했습니다.')
    }
  }
}
</script>

<style scoped>
@import url("../assets/css/History/history-month-selector.css");
@import url("../assets/css/History/history-container-right.css");
@import url("../assets/css/History/history-container-left.css");
@import url("../assets/css/History/history-pagination.css");
@import url("../assets/css/History/history.css");
@import url("../assets/css/History/history-detail-view.css");
</style>
