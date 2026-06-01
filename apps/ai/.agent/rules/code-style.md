# Aturan Code Style Python

## 1. Standar Penulisan & Formatting
- Ikuti standar **PEP 8**.
- Sangat direkomendasikan menggunakan *formatter* (seperti `Black` atau `Ruff`).

## 2. Type Hinting (Wajib)
- Proyek ini menggunakan arsitektur modern Python. **Setiap fungsi WAJIB memiliki *Type Hints***.
- Contoh: `def process_image(image_path: str) -> dict:`
- Gunakan Pydantic (`BaseModel`) untuk *schema* data yang kompleks.

## 3. Kerapian Kode (Clean Code)
- Penamaan variabel menggunakan `snake_case` (contoh: `user_prompt`), nama kelas menggunakan `PascalCase` (contoh: `AiService`).
- Dilarang keras menaruh komentar kode yang bersifat naratif kecuali dalam bentuk *Docstring* (`"""..."""`) yang menjelaskan tujuan utama fungsi jika fungsinya sangat kompleks. Kode harus bisa menjelaskan dirinya sendiri.
