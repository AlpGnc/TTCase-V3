<template>
    <div class="pages-menu">
      <v-list dense nav class="px-0">
        <!-- Dashboards Ana Menü -->
        <v-list-item @click="toggleActive" :class="{ 'v-list-item--active': active }">
          <v-list-item-icon class="mr-0">
            <v-icon size="14">{{ active ? 'mdi-chevron-down' : 'mdi-chevron-right' }}</v-icon>
          </v-list-item-icon>
          <v-list-item-icon class="mr-2">
            <!-- İkonu burada değiştirdik -->
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Dashboards</v-list-item-title>
        </v-list-item>
  
        <!-- Dashboards Altındaki Sayfalar -->
        <v-expand-transition>
          <v-list v-show="active" class="px-4">
            <v-list-item
              v-for="page in pages"
              :key="page.id"
              dense
              @click="selectPage(page)"
            >
              <v-list-item-title class="pl-8">{{ page.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-expand-transition>
      </v-list>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const active = ref(true);
  
  const pages = [
    { id: 'aviation', title: 'Aviation' },
    { id: 'caseStudy', title: 'Case Study' },
    { id: 'planes', title: 'Planes' },
    { id: 'groundHandling', title: 'Ground Handling' },
  ];
  
  const toggleActive = () => {
    active.value = !active.value;
  };
  
  const selectPage = (page) => {
    // Gelecekteki etkileşimler için kullanılabilir
    console.log('Seçilen sayfa:', page.title);
  };
  </script>
  
  <style scoped lang="sass">
  .pages-menu
    .v-list-item--dense
      min-height: 28px
      position: relative
      &::after
        width: 4px
        height: 0
        min-height: 0
        background-color: #8A8CD9
        position: absolute
        left: 0
        top: 50%
        transform: translateY(-50%)
        border-radius: 3px
        transition: all ease-in-out .3s
      &.v-list-item--active
        &::before
          border-radius: 8px
        &::after
          min-height: 16px
          height: 16px
  </style>
  