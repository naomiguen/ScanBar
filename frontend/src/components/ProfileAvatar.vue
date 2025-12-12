<template>
  <div class="flex flex-col items-center gap-4 mt-8">
    <!-- Avatar Container -->
    <div class="relative group">
      <!-- Display Avatar or Initials -->
      <div
        v-if="avatarUrl"
        class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg cursor-pointer"
        @click="triggerFileInput"
      >
        <img
          :src="avatarUrl"
          class="w-full h-full object-cover"
          alt="Profile Avatar"
          @error="handleImageError"
        />
      </div>

      <div
        v-else
        class="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold border-4 border-gray-200 shadow-lg cursor-pointer"
        @click="triggerFileInput"
      >
        {{ userInitials }}
      </div>

      <!-- Small edit button (pencil icon only) -->
      <button
        @click.stop="triggerFileInput"
        class="absolute -bottom-1 -right-1 w-10 h-10 flex items-center justify-center transition-all duration-150 hover:scale-110"
        title="Ganti foto profil"
      >
        <i class="fa-solid fa-pen text-blue-500 text-xl"></i>
      </button>
    </div>

    <!-- File Input (Hidden) -->
    <input
      type="file"
      ref="fileInput"
      accept="image/jpeg,image/png,image/jpg,image/webp"
      class="hidden"
      @change="handleFileUpload"
    />

    <!-- Status Messages -->
    <div class="text-center">
      <p v-if="uploading" class="text-sm text-blue-600 font-semibold animate-pulse">
        <i class="fa-solid fa-spinner fa-spin mr-2"></i>Mengupload...
      </p>
      <p v-else-if="error" class="text-sm text-red-600 font-semibold">
        <i class="fa-solid fa-exclamation-circle mr-2"></i>{{ error }}
      </p>
      <p v-else class="text-xs text-white">
        Klik untuk mengganti foto profil
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { supabase } from '@/supabaseClient.js'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const BUCKET = 'photo profil scanbar'
const fileInput = ref(null)
const uploading = ref(false)
const error = ref('')

// Computed properties
const avatarUrl = computed(() => authStore.user?.user_metadata?.avatar_url || authStore.user?.avatar_url)

const userInitials = computed(() => {
  const name = authStore.user?.user_metadata?.name || authStore.user?.email
  if (!name) return '?'

  const names = name.split(' ')
  if (names.length > 1) {
    return (names[0][0] + names[names.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
})

// Functions
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleImageError = (e) => {
  console.error('Error loading image:', e)
  // Fallback ke inisial jika gambar gagal dimuat
  e.target.style.display = 'none'
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validasi ukuran file (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    error.value = 'Ukuran file maksimal 5MB'
    setTimeout(() => error.value = '', 3000)
    return
  }

  // Validasi tipe file
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    error.value = 'Format file harus JPG, PNG, atau WEBP'
    setTimeout(() => error.value = '', 3000)
    return
  }

  uploading.value = true
  error.value = ''

  try {
    const user = authStore.user
    if (!user) throw new Error('User tidak ditemukan')

    // Hapus foto lama jika ada
    const oldAvatarUrl = avatarUrl.value
    if (oldAvatarUrl) {
      const oldPath = extractPathFromUrl(oldAvatarUrl)
      if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath])
      }
    }

    //Upload file baru
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}_${Date.now()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    console.debug('Uploading avatar', { bucket: BUCKET, path: filePath, name: file.name, size: file.size, type: file.type })
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.debug('Supabase upload error', uploadError)
      // surface more info for debugging
      throw uploadError
    }

    // Dapatkan URL publik
    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(filePath)

    const publicUrl = publicUrlData.publicUrl

    // 4. Update user metadata di Supabase Auth
    const { data: updatedAuthData, error: updateError } = await supabase.auth.updateUser({
      data: {
        avatar_url: publicUrl
      }
    })

    if (updateError) throw updateError

    // Update local auth user state if available and refresh profile
    if (updatedAuthData?.user) {
      authStore.user = updatedAuthData.user
    }
    await authStore.fetchUserProfile()

    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = ''
    }

  } catch (err) {
      console.error('Error uploading avatar:', err)
      if (err && err.message && err.message.toLowerCase().includes('bucket not found')) {
        error.value = `Bucket \"${BUCKET}\" tidak ditemukan. Buat bucket ini di Supabase Storage dashboard.`
      } else {
        error.value = err.message || 'Gagal mengupload foto'
      }
    setTimeout(() => error.value = '', 5000)
  } finally {
    uploading.value = false
  }
}

const confirmDelete = async () => {
  if (!confirm('Apakah Anda yakin ingin menghapus foto profil?')) return

  uploading.value = true
  error.value = ''

  try {
    const user = authStore.user
    if (!user) throw new Error('User tidak ditemukan')

    const currentAvatarUrl = avatarUrl.value
    if (!currentAvatarUrl) return

    // 1. Hapus file dari storage
    const filePath = extractPathFromUrl(currentAvatarUrl)
      if (filePath) {
      const { error: deleteError } = await supabase.storage
        .from(BUCKET)
        .remove([filePath])

      if (deleteError) throw deleteError
    }

    // 2. Update user metadata (hapus avatar_url)
    const { data: updatedAuthData, error: updateError } = await supabase.auth.updateUser({
      data: {
        avatar_url: null
      }
    })

    if (updateError) throw updateError

    // Update local auth user state if available and refresh profile
    if (updatedAuthData?.user) {
      authStore.user = updatedAuthData.user
    }
    // 3. Refresh profile data
    await authStore.fetchUserProfile()

    } catch (err) {
    console.error('Error deleting avatar:', err)
    if (err && err.message && err.message.toLowerCase().includes('bucket not found')) {
      error.value = `Bucket \"${BUCKET}\" tidak ditemukan. Buat bucket ini di Supabase Storage dashboard.`
    } else {
      error.value = err.message || 'Gagal menghapus foto'
    }
    setTimeout(() => error.value = '', 5000)
  } finally {
    uploading.value = false
  }
}

const extractPathFromUrl = (url) => {
  if (!url) return null
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname // e.g. /storage/v1/object/public/<bucket>/<path>

    // find the '/object/' segment and take the rest
    const objectIndex = pathname.indexOf('/object/')
    if (objectIndex === -1) {
      // fallback: try to locate the bucket segment directly
      const parts = pathname.split('/')
      const idx = parts.indexOf(BUCKET)
      if (idx === -1) return null
      return decodeURIComponent(parts.slice(idx + 1).join('/'))
    }

    let rest = pathname.slice(objectIndex + '/object/'.length) // e.g. 'public/<bucket>/<path>' or '<bucket>/<path>'

    // if it starts with 'public/', remove it
    if (rest.startsWith('public/')) rest = rest.slice('public/'.length)

    const parts = rest.split('/')
    // first part is bucket, the rest is the file path
    if (parts.length < 2) return null
    const filePathParts = parts.slice(1)
    return decodeURIComponent(filePathParts.join('/'))
  } catch {
    return null
  }
}
</script>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
