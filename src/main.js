import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap'
import './assets/style.css'

// import VueSimpleAlert from './plugins/simple-alert';

createApp(App)
    // .use(VueSimpleAlert)
    .use(createPinia())
    .mount('#app');