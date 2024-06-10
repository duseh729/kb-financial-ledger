<template lang="">
  <div>
    <Header />
    <div class="root-container">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import Header from "./components/Header.vue";
</script>
<style scoped>
.root-container {
  padding: 32px;
}
</style>
