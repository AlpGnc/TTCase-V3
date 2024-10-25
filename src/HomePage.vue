<template>
  <!-- Ana container -->
  <v-container class="my-5">
    <!-- Ürün başlığı ve sıralama kısmı -->
    <h2>Our Products</h2>

    <!-- Ürün sayısı ve sıralama menüsü -->
    <div class="d-flex justify-space-between align-center mb-4">
      <div>
        <strong>{{ products.length }} Products</strong>
        <v-select
          v-model="sortBy"
          :items="['In Progress', 'Completed', 'Pending']"
          label="Sort By"
          class="ml-3"
        ></v-select>
      </div>

      <!-- Yeni ürün ekleme butonu -->
      <v-btn color="primary" class="add-product-btn" @click="dialog = true">
        Add New Product
      </v-btn>
    </div>

    <!-- Ürün listesi -->
    <v-row v-for="(product, index) in sortedProducts" :key="index" class="mb-3">
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
                @click="deleteProduct(index)"
                class="delete-btn"
              >
                Delete
              </v-btn>
            </div>
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
              <v-chip v-for="tag in product.tags" :key="tag" class="ml-2">{{
                tag
              }}</v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Show more button -->
    <v-btn block color="primary" @click="showMore" class="show-more-btn">
      Show More
    </v-btn>

    <!-- Ürün ekleme formu için dialog -->
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
          <!-- Ürün adı girişi -->
          <v-text-field
            label="Product Name"
            v-model="newProduct.name"
            outlined
            required
          ></v-text-field>

          <!-- Ürün açıklaması girişi -->
          <v-textarea
            label="Description"
            v-model="newProduct.description"
            outlined
            required
          ></v-textarea>

          <!-- Ürün durumu seçimi -->
          <v-select
            label="Select Status"
            v-model="newProduct.status"
            :items="['In Progress', 'Completed', 'Pending']"
            outlined
            required
          ></v-select>

          <!-- Ürün etiketleri checkbox olarak -->
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
              <v-checkbox v-model="newProduct.tags.ux" label="UX"></v-checkbox>
            </v-col>
            <v-col cols="3">
              <v-checkbox v-model="newProduct.tags.ui" label="UI"></v-checkbox>
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
          <v-btn color="primary" @click="saveProduct">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  name: "HomePage",
  data() {
    return {
      dialog: false, // Dialog açma/kapama kontrolü.
      sortBy: "Status",
      products: [
        {
          name: "[Product Name]",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dictum varius molestie.",
          status: "Completed",
          tags: ["Frontend", "UX", "Bug"],
        },
        {
          name: "[Product Name]",
          description:
            "Mauris dictum varius molestie. Vestibulum nec vehicula nibh. Etiam eu velit metus.",
          status: "Pending",
          tags: ["UI", "Bug"],
        },
        {
          name: "[Product Name]",
          description:
            "Vestibulum vel vehicula metus. Praesent faucibus elementum lacus, ut aliquam turpis.",
          status: "In Progress",
          tags: ["Frontend", "UX"],
        },
      ],
      // Yeni ürün bilgileri
      newProduct: {
        name: "",
        description: "",
        status: "",
        tags: {
          frontend: false,
          ux: false,
          ui: false,
          bug: false,
        },
      },
    };
  },
  computed: {
    sortedProducts() {
      if (!this.sortBy) {
        return this.products;
      }

      return [...this.products].sort((a) => {
        if (this.sortBy === "In Progress") {
          return a.status === "In Progress" ? -1 : 1;
        } else if (this.sortBy === "Completed") {
          return a.status === "Completed" ? -1 : 1;
        } else if (this.sortBy === "Pending") {
          return a.status === "Pending" ? -1 : 1;
        }
        return 0;
      });
    },
  },
  methods: {
    deleteProduct(index) {
      this.products.splice(index, 1);
    },
    addNewProduct() {
      this.dialog = true; // Formu açmak için dialog'u true yap
    },
    saveProduct() {
      const selectedTags = Object.keys(this.newProduct.tags).filter(
        (tag) => this.newProduct.tags[tag]
      );
      this.products.push({
        name: this.newProduct.name,
        description: this.newProduct.description,
        status: this.newProduct.status,
        tags: selectedTags,
      });
      this.dialog = false; // Dialog'u kapat
      // Formu temizle
      this.newProduct = {
        name: "",
        description: "",
        status: "",
        tags: {
          frontend: false,
          ux: false,
          ui: false,
          bug: false,
        },
      };
    },
    showMore() {
      alert("Show more products...");
    },
  },
};
</script>

<style scoped></style>
