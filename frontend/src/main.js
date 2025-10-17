// frontend/src/main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia'

// 1. Impor library SweetAlert2 dan CSS-nya
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 2. Gunakan plugin SweetAlert2
app.use(VueSweetalert2)

app.mount('#app')
