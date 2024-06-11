<template lang="">
  <div>
    <nav class="flex-default">
      <div id="logo" class="cursor-pointer"><router-link to="/" class="nav-link"> logo</router-link></div>
      <div class="flex-default">
        <ul class="flex-default">
          <router-link to="/history" class="nav-link"><li class="nav-item-padding cursor-pointer">내역</li></router-link>
          <router-link to="/calendar" class="nav-link"><li class="nav-item-padding cursor-pointer">달력</li></router-link>
          <router-link to="/asset" class="nav-link"><li class="nav-item-padding cursor-pointer">자산</li></router-link>
          <router-link to="/statistics" class="nav-link"><li class="nav-item-padding cursor-pointer">통계</li></router-link>
        </ul>
        <div class="nav-item-padding cursor-pointer">profile</div>
      </div>
    </nav>
  </div>
</template>
<script setup></script>
<style scoped>
@import url("../assets/css/header.css");
</style>
