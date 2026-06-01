# Aturan Pengujian (Testing)

Untuk memastikan aplikasi tetap stabil seiring bertambahnya fitur, perhatikan panduan pengujian berikut.

## 1. Lingkup Pengujian (*Scope*)
- Prioritaskan pengujian pada *utility functions* spesifik yang melakukan kalkulasi rumit (seperti kalkulator skor kesehatan finansial, simulasi bunga kredit, pembagian rentang warna / *lerpColor*).
- Pada tingkat UI komponen, pastikan pengujian meliputi kondisi ketersediaan data (*happy path*) maupun tanpa data (*empty state*).

## 2. Penulisan Tes UI & Komponen
- Jika menggunakan Jest / React Testing Library, hindari menguji berdasar nama kelas (class name), melainkan berbasis *Accessibility* (`getByRole`, `getByText`, dll).
- Untuk komponen UI seperti grafik (*Charts*) yang bergantung pada library eksternal (misal: ApexCharts), pastikan struktur komponen ter-render dengan rapi tanpa error (cukup shallow test), karena library pihak ketiga umumnya memblokir pengujian DOM dalam (deep DOM).

## 3. Tanggung Jawab AI Agent
- Saat menulis utilitas atau fungsi kompleks yang baru, AI Agent dianjurkan proaktif mengingatkan pengguna untuk membuat kerangka tes (*test skeleton*) mendampingi fitur tersebut.
