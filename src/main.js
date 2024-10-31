// Plugins
import { registerPlugins } from '@/plugins';

// Components
import App from './App.vue';

// Composables
import { createApp } from 'vue';

// Router
import router from './router';

const app = createApp(App);

registerPlugins(app);

app.use(router);

app.mount('#app');
