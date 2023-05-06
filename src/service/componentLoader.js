import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFireFlameCurved, faFilm, faHand, faComments, faHandHoldingHeart, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import PrimeVue from 'primevue/config'
import Rating from 'primevue/rating'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'

library.add(faFireFlameCurved, faFilm, faComments, faHandHoldingHeart, faLocationDot, faHand)

export function registerComponents(app) {
  app.use(PrimeVue)
  app.use(ToastService);
  app.component('Toast', Toast)
  app.component('fa-icon', FontAwesomeIcon)
  app.component('Rating', Rating)
  app.component('InputText', InputText)
  app.component('Password', Password)
}