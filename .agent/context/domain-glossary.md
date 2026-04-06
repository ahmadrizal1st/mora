# Domain Glossary — Vista & Mora

> Daftar istilah bisnis inti yang digunakan dalam ekosistem Vista & Mora.

## Entitas Utama

| Istilah | Definisi |
|:--------|:---------|
| **Vista** | Aplikasi HR Dashboard untuk perusahaan (B2B). Digunakan oleh owner, admin, dan HR. |
| **Mora** | Aplikasi Personal Finance untuk karyawan (B2C). Digunakan oleh individual employee. |
| **Workspace** | Representasi sebuah perusahaan/bisnis di Vista. Satu user bisa memiliki beberapa workspace. |
| **Workspace Member** | Anggota workspace dengan role: `owner`, `admin`, `hr`, `staff`. |
| **Employee** | Data karyawan yang dikelola di Vista. Bisa di-link ke akun Mora user. |

## Keuangan

| Istilah | Definisi |
|:--------|:---------|
| **Transaction** | Catatan pemasukan atau pengeluaran karyawan di Mora. |
| **Wallet** | Dompet virtual karyawan di Mora. Satu user bisa punya beberapa wallet. |
| **Goal** | Target tabungan karyawan (e.g. "Dana Darurat Rp 10jt"). Bisa auto-allocate dari income. |
| **Split Bill** | Fitur patungan/split pengeluaran antar anggota grup di Mora. |
| **Receipt** | Foto struk yang di-scan OCR untuk otomatis membuat transaction. |

## HR & Payroll

| Istilah | Definisi |
|:--------|:---------|
| **Payroll Run** | Satu kali proses penggajian untuk seluruh karyawan dalam suatu periode (bulan/tahun). |
| **Payroll Item** | Detail gaji per karyawan dalam satu payroll run (gaji pokok, tunjangan, potongan, PPh 21). |
| **Kasbon** | Pinjaman karyawan yang dipotong dari gaji. |
| **Attendance** | Data absensi karyawan (hadir, cuti, sakit, alpha). |
| **Leave Request** | Permohonan cuti/izin dari karyawan. |

## AI System

| Istilah | Definisi |
|:--------|:---------|
| **AI Token** | Kuota harian pemakaian fitur AI per user. Beda limit per plan. |
| **Categorization** | AI otomatis mengelompokkan transaksi ke kategori (makan, transport, dll). |
| **Financial Persona** | Profil spending behavior user yang dianalisis AI (e.g. "Penabung Cerdas"). |
| **AI Advisor** | Chatbot keuangan personal berbasis Gemini di Mora. |

## Roles & Permissions

| Role | Scope | Akses |
|:-----|:------|:------|
| `owner` | Workspace | Full access, termasuk delete workspace dan approve payroll. |
| `admin` | Workspace | Kelola karyawan, payroll, setting. Tidak bisa delete workspace. |
| `hr` | Workspace | Kelola data karyawan, absensi, cuti. Tidak bisa approve payroll. |
| `staff` | Workspace | View-only akses terbatas. |
| `employee` | Mora | Akses penuh ke fitur personal finance Mora. |
