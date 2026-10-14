# Spesifikasi Navigasi & Dropdown Menu SIARSIP

Dokumen ini mendokumentasikan spesifikasi visual dan implementasi kode untuk Navbar utama, khususnya interaksi dropdown **ARSIP ⌵** yang menampilkan menu tahun (2026, 2025) dengan latar belakang merah bata / terracotta box khas SIARSIP Kemhan.

---

## 1. Analisis Visual Navigasi

Berdasarkan tangkapan layar:
1. **Latar Belakang Navbar:** Gelap / Transparan di atas Hero banner (`#0D0E12` atau `bg-black/90`).
2. **Item Navigasi Utama:**
   - **`BERANDA`**: Teks tebal berwarna putih solid (`text-white font-bold`).
   - **`ARSIP ⌵`**: Teks abu-abu terang / putih redup (`text-slate-200`) dengan ikon panah kecil ke bawah (*chevron down*).
   - **`FAQ`**: Teks abu-abu terang / putih redup (`text-slate-200`).
   - **`🔍` (Search Icon)**: Ikon pencarian kaca pembesar di sisi paling kanan.
3. **Dropdown Box `ARSIP`:**
   - **Background Warna:** Merah bata / Dark Rust / Terracotta (`#A62B14` atau `#9B2211`).
   - **Sudut & Border:** Sedikit membulat tipis atau tegak (`rounded-sm`).
   - **Item Daftar:**
     - Ikon kotak dengan segitiga panah bawah (*boxed downward caret* `⮛` / nested dropdown indicator).
     - Angka Tahun: `2026`, `2025` dengan font putih jelas dan spasi vertikal proporsional.
     - Efek Hover: Menjadi sedikit lebih gelap (`hover:bg-[#851C0C]`) saat pointer diarahkan.

---

## 2. Token Warna & Styling (Tailwind CSS)

| Elemen | Token / Hex | Class Tailwind |
| :--- | :--- | :--- |
| **Navbar Background** | `#0D0E12` | `bg-[#0D0E12]/95` |
| **Dropdown Container** | `#A62B14` | `bg-[#A62B14]` |
| **Dropdown Hover** | `#851C0C` | `hover:bg-[#851C0C]` |
| **Teks Aktif** | `#FFFFFF` | `text-white font-bold` |
| **Teks Link Biasa** | `#D1D5DB` | `text-gray-200 hover:text-white` |

---

## 3. Implementasi Kode Komponen (Inertia.js + React)

File ini dapat langsung diletakkan pada: `resources/js/Components/Navbar.jsx`

```jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function Navbar() {
  const [isArsipOpen, setIsArsipOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Menutup dropdown jika user klik di luar area menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsArsipOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const archiveYears = [
    { year: '2026', url: '/arsip/2026' },
    { year: '2025', url: '/arsip/2025' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D0E12]/95 backdrop-blur-sm border-b border-white/10 px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand / Logo Kiri */}
        <div className="flex items-center gap-3">
          <img 
            src="/images/logo-kemhan.png" 
            alt="Logo Kemhan" 
            className="w-8 h-8 object-contain"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span className="text-white font-bold text-sm tracking-wider uppercase">
            SISTEM INFORMASI ARSIP
          </span>
        </div>

        {/* Menu Navigasi Kanan */}
        <div className="flex items-center gap-6 text-sm font-semibold tracking-wide">
          {/* Menu Beranda */}
          <Link 
            href="/" 
            className="text-white font-bold hover:text-gray-300 transition-colors uppercase"
          >
            BERANDA
          </Link>

          {/* Menu Dropdown ARSIP */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsArsipOpen(!isArsipOpen)}
              className="flex items-center gap-1.5 text-gray-200 hover:text-white uppercase transition-colors focus:outline-none"
            >
              <span>ARSIP</span>
              <svg 
                className={`w-3.5 h-3.5 transition-transform duration-200 ${isArsipOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Kotak Dropdown Merah Bata / Terracotta */}
            {isArsipOpen && (
              <div className="absolute right-0 mt-2.5 w-44 bg-[#A62B14] rounded-sm shadow-xl py-1 z-50">
                {archiveYears.map((item) => (
                  <Link
                    key={item.year}
                    href={item.url}
                    onClick={() => setIsArsipOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-white hover:bg-[#851C0C] transition-colors text-sm font-medium"
                  >
                    {/* Ikon Box Panah Bawah Persis Referensi */}
                    <span className="flex items-center justify-center w-4 h-4 border border-white/80 rounded-[2px] text-[10px]">
                      ▼
                    </span>
                    <span>{item.year}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Menu FAQ */}
          <Link 
            href="/faq" 
            className="text-gray-200 hover:text-white uppercase transition-colors"
          >
            FAQ
          </Link>

          {/* Icon Search */}
          <button 
            type="button" 
            aria-label="Pencarian Berkas"
            className="text-gray-200 hover:text-white transition-colors pl-1"
          >
            <svg 
              className="w-4 h-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

      </div>
    </nav>
  );
}
```

---

## 4. Alternatif Implementasi (Inertia.js + Vue 3)

Bagi project yang menggunakan **Vue 3 (`<script setup>`)**, file diletakkan di `resources/js/Components/Navbar.vue`:

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Link } from '@inertiajs/vue3';

const isArsipOpen = ref(false);
const dropdownRef = ref(null);

const archiveYears = [
  { year: '2026', url: '/arsip/2026' },
  { year: '2025', url: '/arsip/2025' }
];

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isArsipOpen.value = false;
  }
};

onMounted(() => document.addEventListener('mousedown', handleClickOutside));
onUnmounted(() => document.removeEventListener('mousedown', handleClickOutside));
</script>

<template>
  <nav class="fixed top-0 left-0 right-0 z-50 bg-[#0D0E12]/95 backdrop-blur-sm border-b border-white/10 px-6 py-3">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      
      <!-- Brand Kiri -->
      <div class="flex items-center gap-3">
        <span class="text-white font-bold text-sm tracking-wider uppercase">
          SISTEM INFORMASI ARSIP
        </span>
      </div>

      <!-- Menu Kanan -->
      <div class="flex items-center gap-6 text-sm font-semibold tracking-wide">
        <Link href="/" class="text-white font-bold uppercase">BERANDA</Link>

        <!-- Dropdown ARSIP -->
        <div class="relative" ref="dropdownRef">
          <button 
            @click="isArsipOpen = !isArsipOpen" 
            class="flex items-center gap-1.5 text-gray-200 hover:text-white uppercase focus:outline-none"
          >
            <span>ARSIP</span>
            <svg class="w-3.5 h-3.5" :class="{ 'rotate-180': isArsipOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Box Dropdown Merah Bata -->
          <div v-if="isArsipOpen" class="absolute right-0 mt-2.5 w-44 bg-[#A62B14] rounded-sm shadow-xl py-1 z-50">
            <Link
              v-for="item in archiveYears"
              :key="item.year"
              :href="item.url"
              @click="isArsipOpen = false"
              class="flex items-center gap-2.5 px-4 py-2 text-white hover:bg-[#851C0C] transition-colors text-sm font-medium"
            >
              <span class="flex items-center justify-center w-4 h-4 border border-white/80 rounded-[2px] text-[10px]">▼</span>
              <span>{{ item.year }}</span>
            </Link>
          </div>
        </div>

        <Link href="/faq" class="text-gray-200 hover:text-white uppercase">FAQ</Link>

        <button type="button" aria-label="Cari" class="text-gray-200 hover:text-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

    </div>
  </nav>
</template>
```