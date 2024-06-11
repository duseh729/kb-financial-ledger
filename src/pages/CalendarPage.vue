<!-- 달력 페이지 -->
<template>
  <div style="padding: 50px">
    <div style="display: flex; gap: 18px;">
      <Calendar />
      <div style="position: relative; top:39px;">
        <AssetStatus />
        <MemoForm />
      </div>
    </div>
  </div>
</template>

<script setup>
import Calendar from "../components/Calendar/Calendar.vue";
import AssetStatus from "../components/Calendar/AssetStatus.vue";
import MemoForm from "../components/Calendar/MemoForm.vue";
</script>

<style scoped></style>
