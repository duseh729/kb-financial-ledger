<template lang="">
  <div class="memo-container">
    <h4>메모</h4>
    <form action="">
      <label for="input-memo">{{ `${year}년 ${month + 1}월 ${date}일` }}</label>
      <input type="text" placeholder="텍스트를 입력하세요." name="input-memo" />
      <p v-for="(item, index) in getDescription()" :key="index">{{ item }}</p>
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
    // console.log(props.financialLedgerData);
    if (props.financialLedgerData[props.year][month] !== undefined) {
      // console.log(props.financialLedgerData[props.year][month])
      if (props.financialLedgerData[props.year][month][date] !== undefined) {
        // console.log(props.financialLedgerData[props.year][month][date])
        const memoTemp = []
        for(let i of props.financialLedgerData[props.year][month][date]){
          if(memoTemp.length>=3){
            break;
            }
          memoTemp.push(i.description)
        }
        // console.log(memoTemp)
        return memoTemp
      }
    }
  }
};
</script>
<style>
@import url("../../assets/css/Calendar/memo-form.css");
</style>
