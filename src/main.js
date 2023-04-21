import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFireFlameCurved, faStar } from '@fortawesome/free-solid-svg-icons'
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

library.add(faFireFlameCurved)

axios.defaults.baseURL = 'https://fantasticstudio.online/api';

const app = createApp(App)

app.use(router)
app.use(PrimeVue)
app.component('fa-icon', FontAwesomeIcon)
app.component('Rating', Rating)
app.component('InputText', InputText)
app.component('Password', Password)

app.mount('#app')
