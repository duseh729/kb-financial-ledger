<template lang="">
  <div>
    <Header />
    <!-- 루트 경로에 padding값을 주어 각 페이지별 레이아웃 맞춤. -->
    <div class="root-container">
      <router-view></router-view>
    </div>
    
    <!-- 가계부 항목 추가는 전체 페이지에서 할 수 있도록 루트에 적용 -->
    <button class="fixed-modal-button" @click="modalOpen">+</button>
    <IncomeExpenseForm :onClose="modalClose" :showModal="modalCheck" @form-submitted="handleSubmit" />
   
    
    <Statistic/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from './components/Header.vue';
import IncomeExpenseForm from './components/IncomeExpenseForm.vue';

const modalCheck = ref(false);

const modalOpen = () => {
  modalCheck.value = true;
};
const modalClose = () => {
  modalCheck.value = false;
};

const handleSubmit = (data) => {
  console.log('Form submitted:', data);
};
</script>

<style>
/* 스타일링 */
</style>
