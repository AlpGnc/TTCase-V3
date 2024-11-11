<template>
  <v-app>
    <AppTopbar />
    <AppSidebar /> <!-- Yan menüyü ekledik -->
    <router-view></router-view>
  </v-app>
</template>

<script setup>
import AppTopbar from '@/components/AppTopbar.vue';
import AppSidebar from '@/components/AppSidebar.vue';
</script>

<style>
/* Global stiller buraya eklenebilir */
</style>
