import { createApp } from 'vue'
import App from './App.vue'
import router from './router/routes.js'
import { registerComponents } from './service/componentLoader'
import apiService from './service/apiService'
import mitt from 'mitt';
import './assets/main.css'
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const emitter = mitt();
const app = createApp(App);

app.use(router);

app.config.globalProperties.$http = apiService;
app.config.globalProperties.emitter = emitter;
app.config.compilerOptions = {
    isCustomElement: tag => tag.startsWith('stripe-'),
  };

registerComponents(app);

app.mount('#app');