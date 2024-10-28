<template>
  <v-container class="my-5">
    <!-- Ürün başlığı ve sıralama kısmı -->
    <h2>Our Products</h2>

    <!-- Ürün sayısı ve sıralama menüsü -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <!-- Toplam ürün sayısını gösterir -->
        <strong>{{ products.length }} Products</strong>

        <!-- Ürünleri duruma göre sıralamak için dropdown menüsü -->
        <v-select
          v-model="sortBy"
          :items="['In Progress', 'Completed', 'Pending']"
          label="Sort By"
          class="ml-3"
        ></v-select>
      </div>

      <!-- Yeni ürün ekleme butonu, openDialog fonksiyonunu tetikler -->
      <v-btn color="primary" class="add-product-btn" @click="openDialog">
        Add New Product
      </v-btn>
    </div>

    <!-- Ürün listesi: Her ürün için bir kart oluşturuluyor -->
    <v-row v-for="(product, index) in sortedProducts" :key="index" class="mb-3">
      <v-col>
        <v-card class="product-card">
          <v-card-text>
            <div class="d-flex justify-space-between">
              <!-- Ürün adı ve açıklaması -->
              <div>
                <h3 class="product-name">{{ product.name }}</h3>
                <p>{{ product.description }}</p>
              </div>

              <!-- Ürünü silmek için buton, deleteProduct fonksiyonunu tetikler -->
              <v-btn
                color="error"
                @click="deleteProduct(index)"
                class="delete-btn"
              >
                Delete
              </v-btn>
            </div>

            <!-- Ürün durumu ve etiketlerini çiplerle gösterir -->
            <div class="d-flex mt-2">
              <v-chip v-if="product.status === 'Completed'" color="green">
                Completed
              </v-chip>
              <v-chip v-if="product.status === 'Pending'" color="orange">
                Pending
              </v-chip>
              <v-chip v-if="product.status === 'In Progress'" color="blue">
                In Progress
              </v-chip>
              <v-chip v-for="tag in product.tags" :key="tag" class="ml-2">{{ tag }}</v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Daha fazla ürün gösterme butonu, showMore fonksiyonunu çağırır -->
    <v-btn block color="primary" @click="showMore" class="show-more-btn">
      Show More
    </v-btn>

    <!-- Yeni ürün ekleme formu için açılır pencere -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-form ref="form" v-model="isFormValid" lazy-validation>
        <v-card>
          <!-- Başlık ve kapatma ikonu -->
          <v-card-title>
            <span class="text-h5">Add New Product</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <!-- Ürün ekleme formu alanları -->
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
          </v-card-text>

          <!-- Form butonları (Kaydet ve İptal) -->
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="dialog = false">Cancel</v-btn>
            <!-- Save butonu, form geçerli değilse devre dışı bırakılır -->
            <v-btn color="primary" @click="submitForm" :disabled="!isFormValid">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      dialog: false, // Formu açmak/kapatmak için kullanılan kontrol
      isFormValid: false, // Form geçerliliğini takip eder
      sortBy: "Status", // Ürünlerin sıralama kriteri
      products: [
        // Örnek ürün listesi
        {
          name: "[Product Name]",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          status: "Completed",
          tags: ["Frontend", "UX", "Bug"],
        },
        {
          name: "[Product Name]",
          description: "Mauris dictum varius molestie.",
          status: "Pending",
          tags: ["UI", "Bug"],
        },
        {
          name: "[Product Name]",
          description: "Vestibulum vel vehicula metus.",
          status: "In Progress",
          tags: ["Frontend", "UX"],
        },
      ],
      newProduct: {
        // Yeni ürün eklemek için form verileri
        name: "", description: "", status: "",
        tags: { frontend: false, ux: false, ui: false, bug: false },
      },
      rules: {
        // Form doğrulama kuralları
        required: value => !!value || 'This field is required.',
        minLength: v => v.length >= 5 || 'Minimum 5 characters required.'
      },
    };
  },
  computed: {
    sortedProducts() {
      // Seçilen duruma göre ürünleri sıralar
      if (!this.sortBy) return this.products;

      return [...this.products].sort((a) => {
        if (this.sortBy === "In Progress") return a.status === "In Progress" ? -1 : 1;
        else if (this.sortBy === "Completed") return a.status === "Completed" ? -1 : 1;
        else if (this.sortBy === "Pending") return a.status === "Pending" ? -1 : 1;
        return 0;
      });
    },
  },
  methods: {
    deleteProduct(index) {
      // Ürünü diziden siler
      this.products.splice(index, 1);
    },
    openDialog() {
      // Formu açar ve önceki doğrulamaları sıfırlar
      this.dialog = true;
      this.$refs.form.resetValidation();
    },
    submitForm() {
      // Form doğrulamayı kontrol eder; geçerliyse ürünü ekler
      if (this.$refs.form.validate()) {
        const selectedTags = Object.keys(this.newProduct.tags).filter(tag => this.newProduct.tags[tag]);
        this.products.push({
          name: this.newProduct.name,
          description: this.newProduct.description,
          status: this.newProduct.status,
          tags: selectedTags,
        });
        this.dialog = false; // Formu kapatır
        this.resetForm(); // Form alanlarını sıfırlar
      }
    },
    resetForm() {
      // Formu sıfırlar ve doğrulamaları temizler
      this.newProduct = {
        name: "", description: "", status: "",
        tags: { frontend: false, ux: false, ui: false, bug: false },
      };
      this.$refs.form.resetValidation();
    },
    showMore() {
      // "Show More" butonuna basıldığında çalışır
      alert("Show more products...");
    },
  },
};
</script>

<style scoped>
/* Özel stiller buraya eklenebilir */
</style>
