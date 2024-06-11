<template lang="">
  <div>
    <Header />
    <div class="root-container">
      <router-view></router-view>
    </div>
    <!-- <router-view></router-view> -->
    <button @click="modalOpen">Modal</button>
    <!-- {{ modalCheck }} -->
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
