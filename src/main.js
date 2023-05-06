import { createApp } from 'vue'
import App from './App.vue'
import router from './router/routes.js'
import { registerComponents } from './service/componentLoader'
import apiService from './service/apiService'
import './assets/main.css'
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App);

app.use(router);

app.config.globalProperties.$http = apiService;

registerComponents(app);

app.mount('#app');