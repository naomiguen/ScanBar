<template>
  <div class="w-full h-[300px] relative overflow-hidden rounded-xl">
    <video ref="videoElement" class="w-full h-full object-cover" autoplay></video>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-[100px] border-2 border-white/80 shadow-[0_0_0_100vmax_rgba(0,0,0,0.5)]"></div>
    <p class="absolute bottom-2.5 left-1/2 -translate-x-1/2 text-white bg-black/70 px-2.5 py-1.5 rounded-lg text-sm">
      {{ statusText }}
    </p>
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
    } catch (err) {
      statusText.value = 'Gagal mendeteksi barcode.';
      console.error('Barcode detection error:', err);
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
