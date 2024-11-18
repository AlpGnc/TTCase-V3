<template>
  <div>
    <!-- Aç/Kapat Butonu (Sidebar'ın dışında sabit) -->
    <v-btn
      icon
      class="sidebar-toggle-btn"
      @click="toggleSidebar"
    >
      <v-icon>{{ isSidebarOpen ? 'mdi-chevron-left' : 'mdi-menu' }}</v-icon>
    </v-btn>

    <!-- Sidebar -->
    <v-navigation-drawer
      v-model="isSidebarOpen"
      app
      width="212"
      color="surface"
      class="app-border-right-effect app-border-color app-sidebar"
    >
      <!-- Logo ve Sidebar İçeriği (Sidebar Açıkken Görünür) -->
      <template v-if="isSidebarOpen">
        <v-img class="my-5" :src="logoPath" width="172" />
        
        <PagesMenu />
        
        <FilterMenu type="tags" />
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PagesMenu from '@/components/PagesMenu.vue';
import FilterMenu from '@/components/FilterMenu.vue';

// Sidebar kontrolü için state
const isSidebarOpen = ref(true);

// Sidebar'ı açıp kapatma fonksiyonu
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// Logo yolu

</script>

<style scoped lang="sass">
.app-sidebar
  .v-subheader
    height: 1rem

  .v-list-item
    cursor: pointer

  .v-list-item--active
    background-color: rgba(0, 0, 0, 0.1)

/* Sidebar dışındaki aç/kapat butonu */
.sidebar-toggle-btn
  position: fixed
  top: 75px
  left: calc(5px) //
  z-index: 2000 // Diğer bileşenlerin üstünde kalması için */
  background-color: #ff6550
  color: white
  border-radius: 50%
  width: 35px
  height: 35px
  display: flex
  justify-content: center
  align-items: center
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3)

  &:hover
    background-color: #333
    cursor: pointer
</style>
