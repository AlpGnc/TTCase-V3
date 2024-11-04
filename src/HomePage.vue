<template>
  <!-- Ana konteyner, ürün listesi ve filtre menüsünü içerir -->
  <v-container class="my-5">
    <v-row>
      <!-- Filtre Menüsü Sol Sütunda -->
      <v-col cols="3" class="filter-column">
        <FilterMenu /> <!-- Filtre menüsünü buraya dahil ettik -->
      </v-col>

      <!-- Ürün Listesi Sağ Sütunda -->
      <v-col cols="9">
        <h2>Our Products</h2>
        <!-- Ürün sayısını gösteren başlık ve sıralama seçeneği -->
        <div class="d-flex justify-space-between align-center mb-4">
          <div>
            <strong>{{ filteredProducts.length }} Products</strong>

            <!-- Ürünleri duruma göre sıralamak için bir seçim menüsü -->
            <v-select
              v-model="sortBy"
              :items="['In Progress', 'Completed', 'Pending']"
              label="Sort By"
              class="ml-3"
            ></v-select>
          </div>

          <!-- Yeni ürün eklemek için buton, dialog açılır -->
          <v-btn color="primary" class="add-product-btn" @click="addNewProduct">
            Add New Product
          </v-btn>
        </div>

        <!-- Ürün listesi, filtrelenmiş ürünleri gösterir -->
        <v-row v-for="product in filteredProducts" :key="product.id" class="mb-3">
          <v-col>
            <v-card class="product-card">
              <v-card-text>
                <!-- Ürün başlığı ve açıklaması -->
                <div class="d-flex justify-space-between">
                  <div>
                    <h3 class="product-name">{{ product.name }}</h3>
                    <p>{{ product.description }}</p>
                  </div>
                  <!-- Ürün silme butonu -->
                  <v-btn
                    color="error"
                    @click="deleteProduct(product.id)"
                    class="delete-btn"
                  >
                    Delete
                  </v-btn>
                </div>
                <!-- Ürün durumu ve etiketleri gösteren çipler -->
                <div class="d-flex mt-2">
                  <v-chip v-if="product.status === 'Completed'" color="green">Completed</v-chip>
                  <v-chip v-if="product.status === 'Pending'" color="orange">Pending</v-chip>
                  <v-chip v-if="product.status === 'In Progress'" color="blue">In Progress</v-chip>
                  <v-chip v-for="tag in product.tags" :key="tag" class="ml-2">{{ tag }}</v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <!-- Yeni ürün ekleme formu için açılır pencere (dialog) -->
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
          <!-- Ürün ekleme formu, doğrulama ile birlikte -->
          <v-form ref="form" v-model="isFormValid" lazy-validation>
            <!-- Ürün adı -->
            <v-text-field
              label="Product Name"
              v-model="newProduct.name"
              outlined
              :rules="[rules.required, rules.minLength]"
              required
            ></v-text-field>

            <!-- Ürün açıklaması -->
            <v-textarea
              label="Description"
              v-model="newProduct.description"
              outlined
              :rules="[rules.required]"
              required
            ></v-textarea>

            <!-- Ürün durumu (status) seçme menüsü -->
            <v-select
              label="Select Status"
              v-model="newProduct.status"
              :items="['In Progress', 'Completed', 'Pending']"
              outlined
              :rules="[rules.required]"
              required
            ></v-select>

            <!-- Ürün etiketleri (tags) seçme alanı -->
            <v-row>
              <v-col cols="12">
                <label>Select Tags</label>
              </v-col>
              <v-col cols="3">
                <v-checkbox v-model="newProduct.tags.frontend" label="Frontend"></v-checkbox>
              </v-col>
              <v-col cols="3">
                <v-checkbox v-model="newProduct.tags.ux" label="UX"></v-checkbox>
              </v-col>
              <v-col cols="3">
                <v-checkbox v-model="newProduct.tags.ui" label="UI"></v-checkbox>
              </v-col>
              <v-col cols="3">
                <v-checkbox v-model="newProduct.tags.bug" label="Bug"></v-checkbox>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <!-- Formu gönderme butonu, submitForm metodunu çağırır -->
          <v-btn color="primary" @click="submitForm">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { useFilterStore } from '@/stores/useFilterStore';
import FilterMenu from './components/FilterMenu.vue';
import apiClient from "@/services/api";

export default {
  components: { FilterMenu },
  setup() {
    const filterStore = useFilterStore(); // Filtre durumlarını yöneten Pinia mağazası
    const products = ref([]); // Tüm ürünleri tutan dizi
    const sortBy = ref(""); // Ürünleri sıralamak için kullanılan değer
    const dialog = ref(false); // Ürün ekleme formu dialogunun görünürlüğünü kontrol eder
    const isFormValid = ref(false); // Form doğrulamasını izler
    const newProduct = ref({
      name: "",
      description: "",
      status: "",
      tags: { frontend: false, ux: false, ui: false, bug: false },
    }); // Yeni ürün bilgilerini tutan obje

    // Filtrelenmiş ürünleri hesaplayan özellik, filtre durumu ve tag'lara göre filtreler
    const filteredProducts = computed(() => {
      return products.value.filter((product) => {
        const statusMatch =
          filterStore.filters.status.length === 0 ||
          filterStore.filters.status.includes(product.status);
        const tagsMatch =
          filterStore.filters.tags.length === 0 ||
          product.tags.some((tag) => filterStore.filters.tags.includes(tag));
        return statusMatch && tagsMatch;
      });
    });

    // Ürünleri API'den çeken asenkron fonksiyon
    const getItems = async () => {
      try {
        const response = await apiClient.get("/products");
        products.value = response.data;
      } catch (error) {
        console.error("Ürünler yüklenirken hata oluştu:", error);
      }
    };

    // Yeni ürün eklemek için formu açar
    const addNewProduct = () => {
      dialog.value = true;
    };

    // Form gönderildiğinde çağrılır, yeni ürünü API'ye kaydeder
    const submitForm = async () => {
      if (!isFormValid.value) return;

      const selectedTags = Object.keys(newProduct.value.tags).filter(
        (tag) => newProduct.value.tags[tag]
      );

      const productData = {
        name: newProduct.value.name,
        description: newProduct.value.description,
        status: newProduct.value.status,
        tags: selectedTags,
      };

      try {
        await apiClient.post("/products", productData);
        dialog.value = false; // Formu kapatır
        await getItems(); // Ürün listesini yeniler
      } catch (error) {
        console.error("Ürün eklenirken hata oluştu:", error);
      }
    };

    // Bir ürünü siler ve listeyi yeniler
    const deleteProduct = async (productId) => {
      if (!productId) return;

      try {
        await apiClient.delete(`/products/${productId}`);
        await getItems(); // Ürün listesini günceller
      } catch (error) {
        console.error("Ürün silinirken hata oluştu:", error);
      }
    };

    onMounted(() => {
      getItems(); // Sayfa yüklendiğinde ürünleri çeker
    });

    return {
      filteredProducts,
      sortBy,
      deleteProduct,
      addNewProduct,
      dialog,
      isFormValid,
      newProduct,
      submitForm,
    };
  },
  data() {
    return {
      rules: {
        required: (value) => !!value || "This field is required.",
        minLength: (v) => v.length >= 5 || "Minimum 5 characters required.",
      },
    };
  },
};
</script>

<style scoped>
.filter-column {
  max-width: 250px; /* Filtre menüsü genişliğini sınırlama */
  padding-right: 20px; /* Sağ taraf boşluğu */
}
</style>
