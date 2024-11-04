<template>
  <div class="filter-menu">
    <h3>Status</h3>
    <v-checkbox
      v-for="option in statusOptions"
      :key="option"
      :label="option"
      :value="option"
      v-model="selectedStatus"
      @change="updateFilter"
    />

    <h3>Tags</h3>
    <v-checkbox
      v-for="option in tagOptions"
      :key="option"
      :label="option"
      :value="option"
      v-model="selectedTags"
      @change="updateFilter"
    />
  </div>
</template>

<script>
import { ref } from "vue";
import { useFilterStore } from "@/stores/useFilterStore";

export default {
  name: "FilterMenu",
  setup() {
    const filterStore = useFilterStore();
    const selectedStatus = ref([...filterStore.filters.status]);
    const selectedTags = ref([...filterStore.filters.tags]);

    const statusOptions = ["In Progress", "Completed", "Pending"];
    const tagOptions = ["frontend", "ux", "ui", "bug"];

    const updateFilter = () => {
      filterStore.updateStatus(selectedStatus.value);
      filterStore.updateTags(selectedTags.value);
    };

    return {
      statusOptions,
      tagOptions,
      selectedStatus,
      selectedTags,
      updateFilter,
    };
  },
};
</script>

<style scoped>
/* İstediğiniz özel stilleri burada ekleyebilirsiniz */
</style>
