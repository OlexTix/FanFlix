import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faFireFlameCurved, faFilm, faHand, faComments, faHandHoldingHeart, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import PrimeVue from 'primevue/config'
import Rating from 'primevue/rating'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import Breadcrumb from 'primevue/breadcrumb'
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import FileUpload from 'primevue/fileupload';
import Toolbar from 'primevue/toolbar';
import Tag from 'primevue/tag';
import Textarea from 'primevue/textarea';
import Dropdown from 'primevue/dropdown';
import RadioButton from 'primevue/radiobutton';
import InputNumber from 'primevue/inputnumber';
import MultiSelect from 'primevue/multiselect';
import Calendar from 'primevue/calendar';
import Tooltip from 'primevue/tooltip';
import Menubar from 'primevue/menubar';

library.add(faFireFlameCurved, faFilm, faComments, faHandHoldingHeart, faLocationDot, faHand)

export function registerComponents(app) {
  app.use(PrimeVue)
  app.use(ToastService);
  app.component('Toast', Toast)
  app.component('fa-icon', FontAwesomeIcon)
  app.component('Rating', Rating)
  app.component('InputText', InputText)
  app.component('Password', Password)
  app.component('Breadcrumb', Breadcrumb)
  app.component('DataTable', DataTable)
  app.component('Column', Column)
  app.component('Dialog', Dialog)
  app.component('Button', Button);
  app.component('FileUpload', FileUpload);
  app.component('Toolbar', Toolbar);
  app.component('Tag', Tag);
  app.component('Textarea', Textarea);
  app.component('Dropdown', Dropdown);
  app.component('RadioButton', RadioButton);
  app.component('InputNumber', InputNumber);
  app.component('MultiSelect', MultiSelect);
  app.component('Calendar', Calendar);
  app.component('Menubar', Menubar);
  app.directive('Tooltip', Tooltip);
}