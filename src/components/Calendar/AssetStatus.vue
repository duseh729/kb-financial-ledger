<template lang="">
  <div>
    <div>
      <div class="title">전체</div>
      <p class="value">{{(income - expense).toLocaleString('ko-KR')}}원</p>
    </div>
    <div>
      <div class="title">수입</div>
      <p class="value" style="color: red">{{income.toLocaleString('ko-KR')}}원</p>
    </div>
    <div>
      <div class="title">지출</div>
      <p class="value" style="color: blue">{{expense.toLocaleString('ko-KR')}}원</p>
    </div>
    <div>
      <div class="title">이체</div>
      <p class="value" style="color: green">3,300,000원</p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, watch } from 'vue';

const props = defineProps({
  financialLedgerData: {
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
});

const income = ref(0);
const expense = ref(0);

const updateIncomeExpense = () => {
  income.value = 0;
  expense.value = 0;

  const yearData = props.financialLedgerData[props.year];
  if (yearData) {
    const monthData = yearData[String(props.month+1).padStart(2, '0')];
    if (monthData) {
      for (const [key, value] of Object.entries(monthData)) {
        if (value.type === 'income') {
          income.value += value.amount;
        } else if (value.type === 'expense') {
          expense.value += value.amount;
        }
      }
    }
  }
};

// Watcher 설정
watch(
  () => props.financialLedgerData,
  () => {
    updateIncomeExpense();
  },
  { immediate: true, deep: true }
);

watch(
  () => [props.year, props.month],
  () => {
    updateIncomeExpense();
  }
);
</script>

<style>
@import url("../../assets/css/Calendar/asset-status.css");
</style>
