<template>
  <div id="app">
    <!-- <router-view></router-view> -->
    <button @click="modalOpen">Modal</button>
    <!-- {{ modalCheck }} -->
    <IncomeExpenseForm  :showModal="modalCheck" @form-submitted="handleSubmit" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import IncomeExpenseForm from './components/IncomeExpenseForm.vue';

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
