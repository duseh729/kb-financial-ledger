<template>
  <!-- <div :class="{ 'modal': !showModal }"> -->
  <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-content">
      <div class="income-expense-form">
        <form @submit.prevent="postData">
          <div class="form-group">
            <select id="type" v-model="type" required>
              <option value="income">입력(수입)</option>
              <option value="expense">입력(지출)</option>
            </select>
            <button class="close-button" @click="closeModal">X</button>
          </div>
          <div class="form-group">
            <label for="date">일자</label>
            <input type="date" id="date" v-model="date" required />
          </div>
          <div class="form-group">
            <label for="asset">자산</label>
            <select id="asset" v-model="asset" required>
              <!-- <option value="card">카드</option> -->
              <option value="은행">은행</option>
              <option value="현금">현금</option>
            </select>
          </div>
          <div class="form-group">
            <label for="category">분류</label>
            <select v-if="type === 'income'" id="asset" v-model="category" required>
              <option v-for="(item, index) in incomeCategory" :value="item" :key="index">{{ item }}</option>
            </select>
            <select v-else id="asset" v-model="category" required>
              <option v-for="(item, index) in expenseCategory" :value="item" :key="index">{{ item }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="amount">금액</label>
            <input type="number" id="amount" v-model="amount" required />
          </div>
          <div class="form-group">
            <label for="memo">내용</label>
            <textarea id="memo" v-model="memo" maxlength="10" placeholder="메모 입력(최대 20글자)"></textarea>
          </div>
          <div class="button-container">
            <button type="submit">저장</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  showModal: Boolean,
  onClose: Function, //모달닫기 콜백함수
});

const amount = ref(null);
const type = ref("income");
const category = ref(null);
const memo = ref(null);
const date = ref(null);
const asset = ref(null);

const incomeCategory = ["월급", "용돈", "기타"];
const expenseCategory = ["식비", "쇼핑", "미용비", "교통비", "교육비", "기타"];

// const submitForm = () => {
//   const data = {
//     amount: amount.value,
//     type: type.value,
//     category: category.value,
//     memo: memo.value,
//     date: date.value
//   };
//   const formSubmittedEvent = new CustomEvent('form-submitted', { detail: data });
//   window.dispatchEvent(formSubmittedEvent);

//   amount.value = null;
//   type.value = 'income';
//   category.value = '';
//   memo.value = '';
//   date.value = '';
// };

const postData = () => {
  const data = {
    date: date.value,
    asset: asset.value,
    category: category.value,
    amount: amount.value,
    description: memo.value,
    type: type.value,
  };

  // console.log(data)
  axios
    .post("http://localhost:3001/data", data)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error("Error:", error);
    });

  router.go(router.currentRoute);
};

const closeModal = () => {
  // console.log()
  props.onClose();
};
</script>

<style scoped>
@import url("../assets/css/income-expense-form.css");
</style>
