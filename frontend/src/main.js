import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import { Toaster } from 'vue-sonner'
import './assets/main.css'

const app = createApp(App)

// 1. Gunakan Pinia
app.use(createPinia())
// 2. BARU Gunakan Router
app.use(router)

app.component('Toaster', Toaster)

// 3. Terakhir, mount aplikasi
app.mount('#app')

