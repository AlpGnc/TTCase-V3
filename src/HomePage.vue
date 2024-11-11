<template>
  <!-- Main container holding the product list -->
  <v-container class="my-5">
    <v-row>
      <!-- Product List Column -->
      <v-col cols="12">
        <h2>Our Products</h2>
        <!-- Header with product count and sort option -->
        <div class="d-flex justify-space-between align-center mb-4">
          <div class="d-flex align-center">
            <strong>{{ filteredProducts.length }} Products</strong>

            <!-- Sort by status -->
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Sort By"
              class="ml-3"
              dense
              hide-details
            ></v-select>
          </div>

          <!-- Button to add a new product -->
          <v-btn color="primary" class="add-product-btn" @click="addNewProduct">
            Add New Product
          </v-btn>
        </div>

        <!-- Product list -->
        <v-row>
          <v-col
            v-for="product in filteredProducts"
            :key="product.id"
            cols="12"
            class="mb-3"
          >
            <v-card class="product-card">
              <v-card-text>
                <!-- Product header with name and delete button -->
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <h3 class="product-name">{{ product.name }}</h3>
                    <p>{{ product.description }}</p>
                  </div>
                  <v-btn
                    color="error"
                    @click="deleteProduct(product.id)"
                    class="delete-btn"
                    height="45px"
                    
                  >
                    Delete
                  </v-btn>
                </div>
                <!-- Product status and tags chips -->
                <div class="d-flex mt-2">
                  <v-chip
                    v-if="product.status === 'Completed'"
                    color="green"
                    label
                    class="mr-2"
                  >
                    Completed
                  </v-chip>
                  <v-chip
                    v-if="product.status === 'Pending'"
                    color="orange"
                    label
                    class="mr-2"
                  >
                    Pending
                  </v-chip>
                  <v-chip
                    v-if="product.status === 'In Progress'"
                    color="blue"
                    label
                    class="mr-2"
                  >
                    In Progress
                  </v-chip>
                  <v-chip
                    v-for="tag in product.tags"
                    :key="tag"
                    class="ml-2"
                    label
                  >
                    {{ tag }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Dialog for adding a new product -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">Add New Product</span>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text>
          <!-- New product form -->
          <v-form ref="form" v-model="isFormValid" lazy-validation>
            <!-- Product Name -->
            <v-text-field
              label="Product Name"
              v-model="newProduct.name"
              outlined
              :rules="[rules.required, rules.minLength]"
              required
            ></v-text-field>

            <!-- Description -->
            <v-textarea
              label="Description"
              v-model="newProduct.description"
              outlined
              :rules="[rules.required]"
              required
            ></v-textarea>

            <!-- Status Selection -->
            <v-select
              label="Select Status"
              v-model="newProduct.status"
              :items="statusOptions"
              outlined
              :rules="[rules.required]"
              required
            ></v-select>

            <!-- Tags Selection -->
            <v-row>
              <v-col cols="12">
                <label>Select Tags</label>
              </v-col>
              <v-col cols="3" v-for="tag in availableTags" :key="tag">
                <v-checkbox
                  v-model="newProduct.tags"
                  :label="tag"
                  :value="tag"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <!-- Submit form button -->
          <v-btn color="green" @click="submitForm">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useFilterStore } from '@/stores/useFilterStore';
import apiClient from '@/services/api';

export default {
  setup() {
    const filterStore = useFilterStore();
    const products = ref([]);
    const sortBy = ref('All'); // Initialize sortBy with 'All'
    const dialog = ref(false);
    const isFormValid = ref(false);

    // New product data
    const newProduct = ref({
      name: '',
      description: '',
      status: '',
      tags: [],
    });

    // Options
    const statusOptions = ['In Progress', 'Completed', 'Pending'];
    const sortOptions = ['All', ...statusOptions];
    const availableTags = ['Frontend', 'UX', 'UI', 'Bug'];

    const filteredProducts = computed(() => {
      const searchQuery = filterStore.filters.searchQuery.toLowerCase();

      let productsArray = products.value.filter((product) => {
        const statusMatch =
          filterStore.filters.status.length === 0 ||
          filterStore.filters.status.includes(product.status);

        const tagsMatch =
          filterStore.filters.tags.length === 0 ||
          product.tags.some((tag) => filterStore.filters.tags.includes(tag));

        const searchMatch =
          !searchQuery ||
          product.name.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery);

        return statusMatch && tagsMatch && searchMatch;
      });

      // Sorting logic
      if (sortBy.value && sortBy.value !== 'All') {
        productsArray.sort((a, b) => {
          if (a.status === sortBy.value && b.status !== sortBy.value) {
            return -1;
          } else if (a.status !== sortBy.value && b.status === sortBy.value) {
            return 1;
          } else {
            return 0;
          }
        });
      }

      return productsArray;
    });

    const getItems = async () => {
      try {
        const response = await apiClient.get('/products');
        products.value = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const addNewProduct = () => {
      dialog.value = true;
    };

    const submitForm = async () => {
      if (!isFormValid.value) return;

      const productData = {
        name: newProduct.value.name,
        description: newProduct.value.description,
        status: newProduct.value.status,
        tags: newProduct.value.tags,
      };

      try {
        await apiClient.post('/products', productData);
        dialog.value = false;
        await getItems();
        // Reset form
        newProduct.value = {
          name: '',
          description: '',
          status: '',
          tags: [],
        };
        isFormValid.value = false;
      } catch (error) {
        console.error('Error adding product:', error);
      }
    };

    const deleteProduct = async (productId) => {
      if (!productId) return;

      try {
        await apiClient.delete(`/products/${productId}`);
        await getItems();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    };

    onMounted(() => {
      getItems();
    });

    // Form validation rules
    const rules = {
      required: (value) => !!value || 'This field is required.',
      minLength: (v) => v.length >= 5 || 'Minimum 5 characters required.',
    };

    return {
      filteredProducts,
      sortBy,
      sortOptions,
      statusOptions,
      availableTags,
      deleteProduct,
      addNewProduct,
      dialog,
      isFormValid,
      newProduct,
      submitForm,
      rules,
    };
  },
};
</script>

<style scoped>
/* Add your styles here */


</style>
