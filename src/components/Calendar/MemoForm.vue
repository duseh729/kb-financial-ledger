<template lang="">
  <div class="memo-container">
    <h4>메모</h4>
    <form>
      <label for="input-memo">{{ `${year}년 ${month + 1}월 ${date}일` }}</label>
      <div style="margin-top: 12px">
        <span style="color:red">수입 상세</span> <br>
        <div v-show="getDescription()" v-for="(item, index) in getDescription().incomeMemoTemp" :key="index" class="description-wrapper" >
          <!-- {{item}} -->
          <p>{{ `${item.description}(${item.asset})` }}</p>
          <p>{{ item.amount }}</p>
        </div>
        
        <span style="color:blue">지출 상세</span> 
        <div v-show="getDescription()" v-for="(item, index) in getDescription().expenseMemoTemp" :key="index" class="description-wrapper" >
          <p>{{ `${item.description}(${item.asset})` }}</p>
          <p>{{ item.amount }}</p>
        </div>
      </div>
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

// 캘린더 해당 날짜의 메모를 가져오는 함수
// return incomeMemoTemp, expenseMemoTemp <- 수입 지출 메모 배열 
const getDescription = () => {
  const month = String(props.month + 1).padStart(2, "0");
  const date = String(props.date).padStart(2, "0");
  if (props.financialLedgerData[props.year] !== undefined) {
    // console.log(props.financialLedgerData);
    if (props.financialLedgerData[props.year][month] !== undefined) {
      // console.log(props.financialLedgerData[props.year][month])
      if (props.financialLedgerData[props.year][month][date] !== undefined) {
        // console.log(props.financialLedgerData[props.year][month][date])
        const incomeMemoTemp = [];
        const expenseMemoTemp = [];
        for (let i of props.financialLedgerData[props.year][month][date]) {
          if (incomeMemoTemp.length >= 3 && expenseMemoTemp.length >= 3) {
            break;
          }
          // console.log(i.asset)
          if (i.type === "income" && incomeMemoTemp.length < 3) {
            incomeMemoTemp.push({ description: i.description, amount: i.amount.toLocaleString("ko-KR"), asset: i.asset });
          } else if (i.type === "expense" && expenseMemoTemp.length < 3) {
            expenseMemoTemp.push({ description: i.description, amount: i.amount.toLocaleString("ko-KR"), asset: i.asset });
          }
        }
        console.log(incomeMemoTemp)
        return { incomeMemoTemp, expenseMemoTemp };
      }else{
        return false
      }
    }
  }
};
</script>
<style>
@import url("../../assets/css/Calendar/memo-form.css");
</style>
