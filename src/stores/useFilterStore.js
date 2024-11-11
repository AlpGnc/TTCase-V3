// src/stores/useFilterStore.js
import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filterStore', {
  state: () => ({
    filters: {
      status: [],
      tags: [],
      searchQuery: '', // Arama sorgusu eklendi
    },
  }),
  actions: {
    updateStatus(status) {
      this.filters.status = status;
    },
    updateTags(tags) {
      this.filters.tags = tags;
    },
    updateSearchQuery(query) { // Yeni eylem eklendi
      this.filters.searchQuery = query;
    },
    resetFilters() {
      this.filters = { status: [], tags: [], searchQuery: '' }; // Arama sorgusu sıfırlandı
    },
  },
});
