import Vue from 'vue';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import fontawesome from '@fortawesome/fontawesome';
import faBan from '@fortawesome/fontawesome-free-solid/faBan';
import faBars from '@fortawesome/fontawesome-free-solid/faBars';
import faCalendar from '@fortawesome/fontawesome-free-solid/faCalendar';
import faCalendarMinus from '@fortawesome/fontawesome-free-solid/faCalendarMinus';
import faCalendarTimes from '@fortawesome/fontawesome-free-solid/faCalendarTimes';
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck';
import faCheckCircle from '@fortawesome/fontawesome-free-solid/faCheckCircle';
import faChevronCircleRight from '@fortawesome/fontawesome-free-solid/faChevronCircleRight';
import faClock from '@fortawesome/fontawesome-free-solid/faClock';
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload';
import faExclamationCircle from '@fortawesome/fontawesome-free-solid/faExclamationCircle';
import faFileAlt from '@fortawesome/fontawesome-free-solid/faFileAlt';
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle';
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt';
import faQuestionCircle from '@fortawesome/fontawesome-free-solid/faQuestionCircle';
import faSpinner from '@fortawesome/fontawesome-free-solid/faSpinner';
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes';

import './assets/css/app.css';

import App from './App.vue';

fontawesome.library.add(
  faBan, faBars, faCalendar, faCalendarMinus, faCalendarTimes,
  faCheck, faCheckCircle, faChevronCircleRight, faClock, faDownload,
  faExclamationCircle, faFileAlt, faInfoCircle, faPencilAlt,
  faQuestionCircle, faSpinner, faTimes,
);

Vue.config.productionTip = false;

window.eventBus = new Vue();

new Vue({
  render: h => h(App),
}).$mount('#app');
