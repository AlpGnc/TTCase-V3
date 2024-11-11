<template>
    <v-text-field
      v-model="searchQuery"
      label="Search"
      hide-details
      dense
      append-icon="mdi-magnify"
      class="search-input"
    ></v-text-field>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useFilterStore } from '@/stores/useFilterStore';
  
  const filterStore = useFilterStore();
  
  const searchQuery = computed({
    get: () => filterStore.filters.searchQuery,
    set: (value) => filterStore.updateSearchQuery(value),
  });
  </script>
  
  <style scoped>
  .search-input {
    width: 250px; /* Arama kutusunun genişliğini ayarladık */
  }
  </style>
  