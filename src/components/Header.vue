<template lang="">
  <div>
    <nav class="flex-default">
      <div id="logo" class="cursor-pointer"><router-link to="/" class="nav-link"> logo</router-link></div>
      <div class="flex-default">
        <ul class="flex-default">
          <router-link to="/history" style="text-decoration: none"><li ref="history" class="nav-item cursor-pointer">내역</li></router-link>
          <router-link to="/calendar" style="text-decoration: none"><li ref="calendar" class="nav-item cursor-pointer">달력</li></router-link>
          <router-link to="/asset" style="text-decoration: none"><li ref="asset" class="nav-item cursor-pointer">자산</li></router-link>
          <router-link to="/statistics" style="text-decoration: none"><li ref="statistics" class="nav-item cursor-pointer">통계</li></router-link>
        </ul>
        <div class="nav-item cursor-pointer">로그인</div>
      </div>
    </nav>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const history = ref(null);
const calendar = ref(null);
const asset = ref(null);
const statistics = ref(null);

const updateStyles = () => {
  // 초기화
  // console.log(history.value)
  normalStyle(history.value);
  normalStyle(calendar.value);
  normalStyle(asset.value);
  normalStyle(statistics.value);

  // 현재 경로에 따라 스타일 적용
  if (route.fullPath.includes("history")) {
    visitedStyle(history.value);
  } else if (route.fullPath.includes("calendar")) {
    visitedStyle(calendar.value);
  } else if (route.fullPath.includes("asset")) {
    visitedStyle(asset.value);
  } else if (route.fullPath.includes("statistics")) {
    visitedStyle(statistics.value);
  }
};

const normalStyle = item => {
  item.style.fontWeight = "normal";
  // item.style.backgroundColor = "inherit"
};
const visitedStyle = item => {
  item.style.fontWeight = "700";
  // item.style.backgroundColor = "gray"x
};

// 컴포넌트가 마운트될 때 스타일 업데이트
onMounted(updateStyles);

// 경로가 변경될 때마다 스타일 업데이트
watch(() => route.fullPath, updateStyles);
</script>
<style scoped>
@import url("../assets/css/header.css");
</style>
