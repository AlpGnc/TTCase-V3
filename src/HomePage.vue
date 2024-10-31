<template>
  <v-container class="my-5">
    <!-- Ürün başlığı ve sıralama kısmı -->
    <h2>Our Products</h2>

    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <!-- Toplam ürün sayısını gösterir -->
        <strong>{{ products.length }} Products</strong>

        <v-select
          v-model="sortBy"
          :items="['In Progress', 'Completed', 'Pending']"
          label="Sort By"
          class="ml-3"
        ></v-select>
      </div>

      <!-- Yeni ürün ekleme butonu -->
      <v-btn color="primary" class="add-product-btn" @click="addNewProduct">
        Add New Product
      </v-btn>
    </div>

    <!-- Ürün listesi -->
    <v-row v-for="product in sortedProducts" :key="product.id" class="mb-3">
      <v-col>
        <v-card class="product-card">
          <v-card-text>
            <div class="d-flex justify-space-between">
              <div>
                <h3 class="product-name">{{ product.name }}</h3>
                <p>{{ product.description }}</p>
              </div>
              <v-btn
                color="error"
                @click="deleteProduct(product.id)"
                class="delete-btn"
              >
                Delete
              </v-btn>
            </div>
            <div class="d-flex mt-2">
              <v-chip v-if="product.status === 'Completed'" color="green"
                >Completed</v-chip
              >
              <v-chip v-if="product.status === 'Pending'" color="orange"
                >Pending</v-chip
              >
              <v-chip v-if="product.status === 'In Progress'" color="blue"
                >In Progress</v-chip
              >
              <v-chip v-for="tag in product.tags" :key="tag" class="ml-2">{{
                tag
              }}</v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Show more button -->
    <v-btn
      block
      color="primary"
      @click="getItems"
      v-if="!hideLoadButton"
      class="show-more-btn"
    >
      Show More
    </v-btn>

    <!-- Yeni ürün ekleme formu için açılır pencere -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-form ref="form" v-model="isFormValid" lazy-validation>
        <v-card>
          <v-card-title>
            <span class="text-h5">Add New Product</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text>
            <!-- Ürün adı giriş alanı -->
            <v-text-field
              label="Product Name"
              v-model="newProduct.name"
              outlined
              :rules="[rules.required, rules.minLength]"
              required
            ></v-text-field>

            <!-- Ürün açıklama alanı -->
            <v-textarea
              label="Description"
              v-model="newProduct.description"
              outlined
              :rules="[rules.required]"
              required
            ></v-textarea>

            <!-- Ürün durumu seçme menüsü -->
            <v-select
              label="Select Status"
              v-model="newProduct.status"
              :items="['In Progress', 'Completed', 'Pending']"
              outlined
              :rules="[rules.required]"
              required
            ></v-select>

            <!-- Ürün etiketleri seçimi (checkbox) -->
            <v-row>
              <v-col cols="12">
                <label>Select Tags</label>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  v-model="newProduct.tags.frontend"
                  label="Frontend"
                ></v-checkbox>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  v-model="newProduct.tags.ux"
                  label="UX"
                ></v-checkbox>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  v-model="newProduct.tags.ui"
                  label="UI"
                ></v-checkbox>
              </v-col>
              <v-col cols="3">
                <v-checkbox
                  v-model="newProduct.tags.bug"
                  label="Bug"
                ></v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = false">Cancel</v-btn>
            <!-- Formun geçerli olmasına bakarak save butonunun işlevini engelliyoruz -->
            <v-btn color="primary" @click="submitForm">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script>
import apiClient from "@/services/api";
import cloneDeep from "lodash/cloneDeep";

export default {
  name: "HomePage",
  data() {
    return {
      dialog: false,
      isFormValid: false,
      sortBy: "",
      products: [],
      formData: {},
      loading: false,
      hideLoadButton: false,
      showLoaders: false,
      listQueryParams: {
        _page: 1,
        _limit: 10,
      },
      newProduct: {
        name: "",
        description: "",
        status: "",
        tags: { frontend: false, ux: false, ui: false, bug: false },
      },
      rules: {
        required: (value) => !!value || "This field is required.",
        minLength: (v) => v.length >= 5 || "Minimum 5 characters required.",
        minTagsSelected: () => {
          const tags = Object.values(this.newProduct.tags);
          return tags.includes(true) || "At least one tag must be selected.";
        },
      },
    };
  },
  computed: {
    sortedProducts() {
      let filteredProducts = this.products;

      if (this.sortBy && this.sortBy !== "Status") {
        filteredProducts = filteredProducts.filter(
          (product) => product.status === this.sortBy
        );
      }

      return filteredProducts;
    },
  },
  mounted() {
    this.getItems();
    // Eğer 'FILTERS_UPDATE' olayını dinlemek istiyorsanız, aşağıdaki satırı aktif edin
    // this.$root.$on('FILTERS_UPDATE', this.filtersUpdateHandler)
  },
  methods: {
    openForm(item) {
      this.formData = cloneDeep(item);
      this.dialog = true;
      // Form verilerini 'newProduct' ile eşleştiriyoruz
      this.newProduct = {
        ...this.formData,
        tags: {
          frontend: this.formData.tags.includes("Frontend"),
          ux: this.formData.tags.includes("UX"),
          ui: this.formData.tags.includes("UI"),
          bug: this.formData.tags.includes("Bug"),
        },
      };
    },
    addNewProduct() {
      // Yeni ürün eklemek için formu açıyoruz
      this.openForm({
        name: "",
        description: "",
        status: "",
        tags: [],
      });
    },
    getItems() {
      this.loading = true;
      apiClient
        .get("products", { params: this.listQueryParams })
        .then((response) => {
          this.products = this.products.concat(response.data);
          this.hideLoadButton = response.data.length === 0;
          // Sayfayı bir artırarak bir sonraki ürün grubunu yüklemeye hazırlıyoruz
          this.listQueryParams._page += 1;
        })
        .catch((error) => {
          console.error(error, "Home@getItems");
        })
        .finally(() => {
          if (this.showLoaders) {
            // Gerçek dünya senaryosunu simüle etmek için yükleme süresini uzatıyoruz
            setTimeout(() => {
              this.loading = false;
              this.showLoaders = false;
            }, 2000);
          } else {
            this.loading = false;
          }
        });
    },
    submitForm() {
      // Form doğrulamayı kontrol ediyor; geçerliyse kaydediyor
      const tagsSelected = Object.values(this.newProduct.tags).some(
        (tag) => tag
      );
      if (this.$refs.form.validate() && tagsSelected) {
        const selectedTags = Object.keys(this.newProduct.tags).filter(
          (tag) => this.newProduct.tags[tag]
        );

        const productData = {
          name: this.newProduct.name,
          description: this.newProduct.description,
          status: this.newProduct.status,
          tags: selectedTags,
        };

        // Eğer formData'da bir id varsa, güncelleme işlemi yapıyoruz
        if (this.formData.id) {
          apiClient
            .put(`/products/${this.formData.id}`, productData)
            .then(() => {
              this.dialog = false;
              this.resetForm();
              this.refreshItems();
            })
            .catch((error) => {
              console.error("Ürün güncellenirken hata oluştu:", error);
            });
        } else {
          // Yeni ürün ekleme işlemi
          apiClient
            .post("/products", productData)
            .then(() => {
              this.dialog = false;
              this.resetForm();
              this.refreshItems();
            })
            .catch((error) => {
              console.error("Ürün eklenirken hata oluştu:", error);
            });
        }
      } else {
        alert("Lütfen tüm alanları doldurun.");
      }
    },
    resetForm() {
      this.newProduct = {
        name: "",
        description: "",
        status: "",
        tags: { frontend: false, ux: false, ui: false, bug: false },
      };
      this.formData = {};
      if (this.$refs.form) {
        this.$refs.form.resetValidation();
      }
    },
    refreshItems() {
      // Ürün listesini sıfırlayıp yeniden yüklüyoruz
      this.products = [];
      this.listQueryParams._page = 1;
      this.getItems();
    },
    deleteProduct(productId) {
      apiClient
        .delete(`/products/${productId}`)
        .then(() => {
          this.refreshItems(); // Ürün listesini güncelle
        })
        .catch((error) => {
          console.error("Ürün silinirken hata oluştu:", error);
        });
    },
    showMore() {
      this.getItems();
    },
    // Eğer filtreleri güncellemek istiyorsanız, aşağıdaki metodu tanımlayabilirsiniz
    // filtersUpdateHandler(filters) {
    //   // Filtreleri uygulamak için gerekli işlemler
    // },
  },
};
</script>

<style scoped></style>
