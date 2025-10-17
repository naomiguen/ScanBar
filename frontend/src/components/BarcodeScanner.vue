<template>
  <div class="scanner-container">
    <video ref="videoElement" class="scanner-video" autoplay></video>
    <div class="overlay"></div>
    <p class="status-text">{{ statusText }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineEmits } from 'vue';

const emit = defineEmits(['scan-success', 'close']);
const videoElement = ref(null);
const statusText = ref('Mempersiapkan kamera...');
let stream = null;
let intervalId = null;

onMounted(async () => {
  if (!('BarcodeDetector' in window)) {
    statusText.value = 'Fitur Barcode Detector tidak didukung di browser ini.';
    return;
  }

  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    videoElement.value.srcObject = stream;

    const barcodeDetector = new window.BarcodeDetector({
      formats: ['ean_13', 'upc_a', 'upc_e'] // Format umum untuk produk retail
    });

    intervalId = setInterval(async () => {
      try {
        const barcodes = await barcodeDetector.detect(videoElement.value);
        if (barcodes.length > 0) {
          clearInterval(intervalId); // Hentikan pemindaian setelah berhasil
          emit('scan-success', barcodes[0].rawValue);
        } else {
          statusText.value = 'Arahkan kamera ke barcode...';
        }
      } catch (e) {
         statusText.value = 'Gagal mendeteksi barcode.';
      }
    }, 500); // Cek setiap 500ms

  } catch (error) {
    statusText.value = 'Kamera tidak dapat diakses. Mohon izinkan akses kamera.';
    console.error('Error accessing camera:', error);
  }
});

onUnmounted(() => {
  // Pastikan interval dan kamera mati saat komponen ditutup
  if (intervalId) clearInterval(intervalId);
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
});
</script>

<style scoped>
.scanner-container {
  width: 100%;
  height: 300px;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
}
.scanner-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 100px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.5);
}
.status-text {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 5px 10px;
  border-radius: 5px;
}
</style>
