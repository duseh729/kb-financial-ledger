<template lang="">
  <div class="memo-container">
    <h4>메모</h4>
    <form action="">
      <label for="input-memo">{{`${year}년 ${month+1}월 ${date}일`}}</label>
      <input type="text" placeholder="텍스트를 입력하세요." name="input-memo">
    </form>
  </div>
</template>
<script setup>
const props = defineProps({
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },
  date: {
    type: Number,
    required: true
  },
});
</script>
<style >
  @import url('../../assets/css/Calendar/memo-form.css');
</style>