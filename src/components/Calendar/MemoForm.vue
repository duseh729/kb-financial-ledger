<template lang="">
  <div class="memo-container">
    <h4>메모</h4>
    <form action="">
      <label for="input-memo">{{ `${year}년 ${month + 1}월 ${date}일` }}</label>
      <input type="text" placeholder="텍스트를 입력하세요." name="input-memo" />
      <p>{{ getDescription() }}</p>
    </form>
  </div>
</template>
<script setup>
import { ref } from "vue";

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
  date: {
    type: Number,
    required: true,
  },
});

// const financialLedgerData = ref(props.financialLedgerData)

const getDescription = () => {
  const month = String(props.month + 1).padStart(2, "0");
  const date = String(props.date).padStart(2, "0");
  if (props.financialLedgerData[props.year] !== undefined) {
    console.log(props.financialLedgerData);
    if (props.financialLedgerData[props.year][month] !== undefined) {
      // console.log(props.financialLedgerData[props.year][month][date].description)
      if (props.financialLedgerData[props.year][month][date] !== undefined) {
        return props.financialLedgerData[props.year][month][date].description;
      }
    }
  }
};
</script>
<style>
@import url("../../assets/css/Calendar/memo-form.css");
</style>
