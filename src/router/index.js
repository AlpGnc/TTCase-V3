/**
 * router/index.ts
 *
 * Yönlendirmeleri ve sayfa yollarını tanımladığımız dosya
 */

// Vue Router'dan gerekli fonksiyonları import ediyoruz
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/HomePage.vue'; // HomePage bileşenini ekliyoruz, bu bileşen ana sayfa olacak

// Routes array: Tüm sayfa yolları burada tanımlanır
const routes = [
  {
    path: '/', // Bu '/' rotası ana sayfaya yönlendirme yapar
    name: 'Home',
    component: HomePage, // Bu rota yüklendiğinde HomePage bileşeni görüntülenir
  },
];

// Router instance oluşturuyoruz
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // URL geçmişine dayalı yönlendirme yapar
  routes, // Rotamızın arrayini buraya ekliyoruz
});

export default router; // Router'ı export ediyoruz ki main.js'de kullanabilelim
