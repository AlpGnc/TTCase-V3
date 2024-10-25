/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from '@/plugins'; // Bu satırda tüm eklentileri (Vuetify gibi) kaydeden fonksiyonu içe aktarıyoruz

// Components
import App from './App.vue'; // Ana uygulama bileşenini buraya dahil ediyoruz

// Composables
import { createApp } from 'vue'; // Vue uygulamasını başlatmak için gerekli fonksiyonu içe aktarıyoruz

// Router
import router from './router'; // Vue Router'ı ekliyoruz, sayfalar arası yönlendirme için gerekli

const app = createApp(App); // Uygulamayı başlatmak için App bileşenini temel alıyoruz

registerPlugins(app); // Vuetify ve diğer eklentileri uygulamaya eklemek için bu fonksiyonu çağırıyoruz

app.use(router); // Router'ı uygulamaya dahil ediyoruz, böylece yönlendirme çalışır

app.mount('#app'); // Uygulama '#app' elementine monte ediliyor (index.html dosyasındaki)
