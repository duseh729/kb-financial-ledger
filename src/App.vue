<template lang="">
  <div>
    <Header />
    <div class="root-container">
      <router-view></router-view>
    </div>
    <!-- <router-view></router-view> -->
    <button @click="modalOpen">Modal</button>
    <!-- {{ modalCheck }} -->
    <IncomeExpenseForm  :showModal="modalCheck" @form-submitted="handleSubmit" />
    <Statistic/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Header from './components/Header.vue';
import IncomeExpenseForm from './components/IncomeExpenseForm.vue';
import Statistic from './components/Statistics.vue';

const modalCheck = ref(false);

const modalOpen = () => {
  modalCheck.value = true;
};

const handleSubmit = (data) => {
  console.log('Form submitted:', data);
};
</script>

<style>
/* 스타일링 */
</style>
