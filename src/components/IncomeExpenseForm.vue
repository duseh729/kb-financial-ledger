<template>
  <div :class="{ 'modal': !showModal }">
    <div class="modal-content">
      <div class="income-expense-form">
        <h2>수입 및 지출 기록</h2>
        <form @submit.prevent="postData">
          <div class="form-group">
            <label for="amount">금액:</label>
            <input type="number" id="amount" v-model="amount" required>
          </div>
          <div class="form-group">
            <label for="type">유형:</label>
            <select id="type" v-model="type" required>
              <option value="income">수입</option>
              <option value="expense">지출</option>
            </select>
          </div>
          <div class="form-group">
            <label for="date">날짜:</label>
            <input type="date" id="date" v-model="date" required>
          </div>
          <div class="form-group">
            <label for="category">카테고리:</label>
            <input type="text" id="category" v-model="category">
          </div>
          <div class="form-group">
            <label for="memo">메모:</label>
            <textarea id="memo" v-model="memo"></textarea>
          </div>
          <button type="submit">제출</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue';
import axios from 'axios';

const props = defineProps({
  showModal: Boolean
});

const amount = ref(null);
const type = ref('income');
const category = ref('');
const memo = ref('');
const date = ref('');

const submitForm = () => {
  const data = {
    amount: amount.value,
    type: type.value,
    category: category.value,
    memo: memo.value,
    date: date.value
  };
  const formSubmittedEvent = new CustomEvent('form-submitted', { detail: data });
  window.dispatchEvent(formSubmittedEvent);
  
  amount.value = null;
  type.value = 'income';
  category.value = '';
  memo.value = '';
  date.value = '';
};

const postData = () => {
  const data = {
    amount: amount.value,
    type: type.value,
    category: category.value,
    memo: memo.value,
    date: date.value
  };
  
 console.log(data)
  axios.post("http://localhost:3000/test", data)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}
</script>

<style scoped>
@import url("../assets/css/income-expense-form.css");
</style>
