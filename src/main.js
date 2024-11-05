// Plugins
import { registerPlugins } from '@/plugins';

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Pinia'yı ekliyoruz

// Router
import router from './router';

const app = createApp(App);

// Pinia ve diğer eklentileri uygulamaya ekliyoruz
const pinia = createPinia(); // Pinia’yı oluşturuyoruz
app.use(pinia); // Uygulamaya Pinia’yı dahil ediyoruz

registerPlugins(app); // Tüm eklentileri kaydediyoruz

app.use(router); // Router'ı ekliyoruz

app.mount('#app'); // Uygulamayı başlatıyoruz
