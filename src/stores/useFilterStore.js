// src/stores/useFilterStore.js
import { defineStore } from 'pinia';

export const useFilterStore = defineStore('filterStore', {
  state: () => ({
    filters: {
      status: [],
      tags: [],
    },
  }),
  actions: {
    updateStatus(status) {
      this.filters.status = status;
    },
    updateTags(tags) {
      this.filters.tags = tags;
    },
    resetFilters() {
      this.filters = { status: [], tags: [] };
    },
  },
});
