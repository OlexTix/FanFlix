import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config';
import Rating from 'primevue/rating';
import InputText from 'primevue/inputtext'
import Password from 'primevue/password';
import Carousel from 'primevue/carousel';
import "primevue/resources/themes/lara-light-indigo/theme.css"; 
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.component('Rating', Rating)
app.component('InputText', InputText)
app.component('Password', Password)
app.component('Carousel', Carousel)

app.mount('#app')
