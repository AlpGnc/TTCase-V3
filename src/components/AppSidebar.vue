<template>
    <v-navigation-drawer
      app
      width="212"
      color="surface"
      class="app-border-right-effect app-border-color app-sidebar"
    >
      <!-- Logo -->
      
  
      <!-- Pages Başlığı -->
      <v-subheader class="mb-2">Pages</v-subheader>
  
      <!-- PagesMenu Bileşeni -->
      <PagesMenu />
  
      <!-- Diğer içerikler (Status, Tags) -->
      
  
      <v-subheader class="mb-2"></v-subheader>
      <FilterMenu type="tags" />
    </v-navigation-drawer>
  </template>
  
  <script setup>
  
  import PagesMenu from '@/components/PagesMenu.vue';
  
  </script>
  
  <style scoped lang="sass">
  .app-sidebar
    .v-subheader
      height: 1rem
  
    .v-list-item
      cursor: pointer
  
    .v-list-item--active
      background-color: rgba(0, 0, 0, 0.1)
  </style>
  