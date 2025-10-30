// frontend/src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Hapus import authStore dari sini

const app = createApp(App)

// 1. Gunakan Pinia DULU
app.use(createPinia())
// 2. BARU Gunakan Router
app.use(router)

// 3. Terakhir, mount aplikasi
app.mount('#app')

