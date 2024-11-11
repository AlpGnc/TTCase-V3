<template>
    <v-app-bar
      app
      color="surface"
      class="app-border-bottom-effect app-border-color app-footer"
      height="72"
    >
      <!-- Logo ve Breadcrumbs yan yana -->
      <div class="logo-and-breadcrumbs">
        <!-- Logo -->
        <v-toolbar-title class="logo-title">
          <img :src="logo" alt="Logo" class="logo" />
        </v-toolbar-title>
  
        <!-- Breadcrumbs -->
        <v-breadcrumbs :items="breadcrumbItems">
          <template #item="{ item }">
            <span :class="{ 'passive-text': !item.disabled }">
              {{ item.text }}
            </span>
          </template>
        </v-breadcrumbs>
      </div>
  
      <v-spacer />
  
      <!-- Arama Girdisi -->
      <div class="search-input-wrapper">
        <AppSearchInput hide-details />
      </div>
    </v-app-bar>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import AppSearchInput from '@/components/ui/AppSearchInput.vue';
  import logo from '@/assets/tav_logo.png'; // Resmi import ettik
  
  const breadcrumbItems = computed(() => {
    return [
      { text: 'Dashboards', disabled: false },
      { text: 'Case Study', disabled: true },
    ];
  });
  </script>
  
  <style scoped>
  .logo-and-breadcrumbs {
    display: flex;
    align-items: center;
  }
  
  .logo-title {
    display: flex;
    align-items: center;
  }
  
  .logo {
    max-height: 40px;
    width: auto;
  }
  
  .v-breadcrumbs {
    font-size: 14px;
    line-height: 1.43;
    margin-left: 20px; /* Breadcrumbs sola yaslandı */
  }
  
  .search-input-wrapper {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    /* padding-top: 24px; */ /* Bu satırı kaldırdık */
    max-width: 250px; /* Genişliği artırdık */
  }
  </style>
  