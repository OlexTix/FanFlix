import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFireFlameCurved, faFilm, faComments, faHandHoldingHeart, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Rating from 'primevue/rating'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import axios from 'axios';
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import './assets/main.css'

library.add(faFireFlameCurved, faFilm, faComments, faHandHoldingHeart, faLocationDot)

const axiosInstance = axios.create({
    baseURL: 'https://api.fanflix.fantasticstudio.online',
});
  
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['x-access-token'] = token;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.component('fa-icon', FontAwesomeIcon)
app.component('Rating', Rating)
app.component('InputText', InputText)
app.component('Password', Password)

app.config.globalProperties.$http = axiosInstance;

app.mount('#app')
