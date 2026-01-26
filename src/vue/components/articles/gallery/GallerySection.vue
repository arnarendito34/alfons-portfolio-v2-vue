<template>
  <section class="gallery-container">
    <div class="grid-layout">
      <div v-for="(item, index) in galleryItems" :key="index" class="card">
        <img :src="item.url" :alt="item.caption" />
        <div class="caption-overlay">
          <p>{{ item.caption }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
// Contoh data, nanti bisa kamu pindahkan ke file JSON atau ambil dari API
const galleryItems = [
  { url: 'link-foto-wisuda.jpg', caption: 'Graduation @ Telkom University' },
  { url: 'screenshot-dashboard.png', caption: 'Data Analysis Project' },
  { url: 'sertifikat.jpg', caption: 'BPSDMP Kominfo Internship' },
  // Tambah sesukamu di sini
];
</script>

<style scoped>
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 20px 0;
}

.card {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 1 / 1; /* Biar kotak sempurna */
  background: #1e1e26; /* Warna gelap sesuai tema kamu */
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card:hover img {
  transform: scale(1.1);
}

.caption-overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.card:hover .caption-overlay {
  opacity: 1;
}
</style>