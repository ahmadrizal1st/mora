"""
Debug Runner: tests/sample_files
=================================
Script ini berjalan independen (tanpa pytest), langsung menghit API
dan mencetak hasil/error secara detail per file.

Jalankan:
    cd /Users/macbook/Documents/visatamora
    python tests/debug_sample_files.py

Flags:
    --url     BASE URL OCR API  (default: http://localhost:8000)
    --key     API Key           (default: dev-secret-key)
    --file    Hanya debug 1 file tertentu
    --verbose Print full teks hasil ekstraksi
"""

import os
import sys
import argparse
import json
import time
import requests

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
SAMPLE_DIR  = os.path.join(os.path.dirname(__file__), "sample_files")
TIMEOUT     = 180

EXPECTED = {
    "struk_restoran.jpg": {
        "type": "image_ocr",
        "engine": "surya",
        "keywords": ["GORENG", "TOTAL", "30.000"],  # Surya may truncate 'BAROKAH' → 'BAI'
    },
    "invoice_indihome.pdf": {
        "type": "pdf_text",
        "engine": "pymupdf",
        "keywords": ["IndiHome", "250.000", "INVOICE"],
    },
    "belanja_april.docx": {
        "type": "document",
        "engine": None,
        "keywords": ["Indomaret", "121.000"],
    },
    "keanggotaan_gym.xlsx": {
        "type": "document",
        "engine": None,
        "keywords": ["FitLife", "350000"],
    },
    "kwitansi_scan.pdf": {
        "type": "pdf_ocr",
        "engine": "surya",
        "keywords": ["KWITANSI", "300.000"],
    },
}

# ─────────────────────────────────────────────
# COLORS
# ─────────────────────────────────────────────
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
CYAN   = "\033[96m"
RESET  = "\033[0m"
BOLD   = "\033[1m"

def ok(msg):    print(f"  {GREEN}✓ {msg}{RESET}")
def fail(msg):  print(f"  {RED}✗ {msg}{RESET}")
def warn(msg):  print(f"  {YELLOW}⚠ {msg}{RESET}")
def info(msg):  print(f"  {CYAN}ℹ {msg}{RESET}")


# ─────────────────────────────────────────────
# HEALTH CHECK
# ─────────────────────────────────────────────
def check_health(base_url: str) -> bool:
    print(f"\n{BOLD}── Health Check ──────────────────────────{RESET}")
    try:
        r = requests.get(f"{base_url}/api/health", timeout=5)
        data = r.json()
        status = data.get("status", "unknown")
        if status == "ok":
            ok(f"API sehat: status={status}, uptime={data.get('uptime_seconds', '?')}s")
            return True
        elif status == "degraded":
            warn(f"API degraded: {data.get('message', '')}")
            return True
        else:
            fail(f"API tidak sehat: {data}")
            return False
    except requests.exceptions.ConnectionError:
        fail(f"Tidak bisa terhubung ke {base_url}")
        print(f"\n{YELLOW}  [DEBUG SKENARIO 1] API tidak jalan:{RESET}")
        print("    → Cek apakah uvicorn sedang running:")
        print("      ps aux | grep uvicorn")
        print("    → Jika tidak, jalankan:")
        print("      cd apps/ocr && source venv/bin/activate && uvicorn main:app --host 0.0.0.0 --port 8000")
        return False
    except Exception as e:
        fail(f"Health check error: {e}")
        return False


# ─────────────────────────────────────────────
# SINGLE FILE TEST + DEBUG
# ─────────────────────────────────────────────
def test_file(filename: str, base_url: str, api_key: str, verbose: bool) -> dict:
    file_path = os.path.join(SAMPLE_DIR, filename)
    exp = EXPECTED.get(filename, {})
    result = {"file": filename, "passed": False, "errors": []}

    print(f"\n{BOLD}── {filename} ──────────────────────────{RESET}")

    # 1. Cek file ada
    if not os.path.exists(file_path):
        fail(f"File tidak ditemukan: {file_path}")
        result["errors"].append("FILE_NOT_FOUND")
        print(f"\n{YELLOW}  [DEBUG] File hilang:{RESET}")
        print("    → Jalankan ulang: python tests/sample_generator.py")
        return result

    size_kb = os.path.getsize(file_path) / 1024
    info(f"File size: {size_kb:.1f} KB")

    # 2. Upload ke API
    try:
        start = time.time()
        with open(file_path, "rb") as f:
            resp = requests.post(
                f"{base_url}/api/extract",
                headers={"X-API-Key": api_key},
                files={"file": (filename, f)},
                data={"language": "id"},
                timeout=TIMEOUT,
            )
        elapsed = time.time() - start
        info(f"Waktu respon: {elapsed:.2f}s")

    except requests.exceptions.Timeout:
        fail(f"TIMEOUT setelah {TIMEOUT}s")
        result["errors"].append("TIMEOUT")
        print(f"\n{YELLOW}  [DEBUG SKENARIO – TIMEOUT]{RESET}")
        print("    → Surya OCR bisa lambat di CPU, coba tingkatkan TIMEOUT")
        print("    → Cek log uvicorn untuk progress model loading")
        print("    → Pastikan model Surya sudah pernah di-download (cache di ~/.cache/)")
        return result

    except Exception as e:
        fail(f"Request error: {e}")
        result["errors"].append(f"REQUEST_ERROR: {e}")
        return result

    # 3. Cek status HTTP
    if resp.status_code != 200:
        fail(f"HTTP {resp.status_code}: {resp.text[:300]}")
        result["errors"].append(f"HTTP_{resp.status_code}")
        _debug_http_error(resp, filename)
        return result

    ok(f"HTTP 200 OK")
    data = resp.json()

    # 4. Cek type
    actual_type  = data.get("type", "")
    exp_type     = exp.get("type", "")
    if actual_type == exp_type:
        ok(f"type = {actual_type}")
    else:
        fail(f"type mismatch: ekspektasi '{exp_type}', dapat '{actual_type}'")
        result["errors"].append(f"TYPE_MISMATCH:{actual_type}")
        _debug_type_mismatch(filename, actual_type, exp_type, data)

    # 5. Cek engine
    actual_engine = data.get("engine_used", "")
    exp_engine    = exp.get("engine")
    if exp_engine and exp_engine.lower() not in actual_engine.lower():
        fail(f"engine mismatch: ekspektasi '{exp_engine}' dalam '{actual_engine}'")
        result["errors"].append(f"ENGINE_MISMATCH:{actual_engine}")
    elif exp_engine:
        ok(f"engine = {actual_engine}")

    # 6. Cek teks tidak kosong
    text = data.get("text", "")
    if len(text.strip()) == 0:
        fail("Teks hasil ekstraksi KOSONG")
        result["errors"].append("EMPTY_TEXT")
        _debug_empty_text(filename, data)
    else:
        ok(f"Teks berhasil diekstrak ({len(text)} karakter)")

    # 7. Cek keywords
    keywords = exp.get("keywords", [])
    for kw in keywords:
        if kw.lower() in text.lower():
            ok(f"keyword '{kw}' ✓")
        else:
            fail(f"keyword '{kw}' TIDAK DITEMUKAN")
            result["errors"].append(f"KEYWORD_MISSING:{kw}")

    # 8. Confidence
    conf = data.get("confidence", 0)
    if conf < 0.3:
        warn(f"Confidence rendah: {conf:.2f} (< 0.3)")
    else:
        ok(f"Confidence: {conf:.2f}")

    # 9. Verbose output
    if verbose:
        print(f"\n  {CYAN}── Teks hasil ──{RESET}")
        print("  " + text[:500].replace("\n", "\n  "))
        if len(text) > 500:
            print(f"  ... (truncated, total {len(text)} chars)")

    # 10. Final
    result["passed"] = len(result["errors"]) == 0
    return result


# ─────────────────────────────────────────────
# DEBUG SCENARIOS
# ─────────────────────────────────────────────
def _debug_http_error(resp: requests.Response, filename: str):
    code = resp.status_code
    body = resp.text[:300]

    print(f"\n  {YELLOW}[DEBUG SKENARIO – HTTP {code}]{RESET}")

    if code == 401:
        print("    PENYEBAB: API Key tidak valid")
        print("    SOLUSI  : Cek nilai OCR_API_KEY atau X-API-Key header")
        print("    CHECK   : cat apps/ocr/.env | grep API_KEY")

    elif code == 400:
        print("    PENYEBAB: File kosong atau nama file tidak ada")
        print(f"    SOLUSI  : Verifikasi file '{filename}' tidak corrupt/kosong")
        print(f"    CHECK   : ls -lh tests/sample_files/{filename}")

    elif code == 413:
        print("    PENYEBAB: File melebihi 100MB")
        print("    SOLUSI  : Compress atau potong file sample")

    elif code == 415:
        print("    PENYEBAB: MIME type tidak dikenali")
        print("    SOLUSI  : Cek MIME type aktual file:")
        print(f"    CHECK   : file --mime-type tests/sample_files/{filename}")
        print("    Daftar MIME yang didukung di apps/ocr/api/router.py → SUPPORTED_MIME_TYPES")

    elif code == 500:
        print("    PENYEBAB: Internal server error di OCR service")
        print("    SOLUSI  : Lihat log uvicorn:")
        print("      tail -100 apps/ocr/ocr_service.log")
        print("    Kemungkinan masalah:")
        print("      1. Surya model belum ter-load (lihat DEBUG SKENARIO SURYA)")
        print("      2. Whisper model gagal import")
        print("      3. File temp /tmp/ocr/ tidak bisa ditulis")

    elif code == 503:
        print("    PENYEBAB: Engine belum siap")
        print("    SOLUSI  : Tunggu hingga model Surya/Whisper selesai loading")
        print("    CHECK   : GET /api/engines (perlu API Key)")

    print(f"    BODY: {body}")


def _debug_type_mismatch(filename: str, actual: str, expected: str, data: dict):
    print(f"\n  {YELLOW}[DEBUG SKENARIO – TYPE MISMATCH]{RESET}")

    if filename.endswith(".pdf"):
        if expected == "pdf_ocr" and actual == "pdf_text":
            print("    PENYEBAB: PDF dianggap memiliki teks selectable padahal gambar")
            print("    PENYEBAB: kwitansi_scan.pdf mungkin dibuat dengan FPDF yang menyisipkan metadata teks")
            print("    SOLUSI  : Cek apakah PyMuPDF bisa baca teks dari file ini:")
            print("      python3 -c \"import fitz; d=fitz.open('tests/sample_files/kwitansi_scan.pdf'); print(d[0].get_text())\"")
            print("    Jika teks terbaca → file bukan pure scan, perlu regenerate dengan gambar murni")
        elif expected == "pdf_text" and actual == "pdf_ocr":
            print("    PENYEBAB: PDF selectable tidak terdeteksi oleh PyMuPDF")
            print("    SOLUSI  : Cek isi PDF:")
            print("      python3 -c \"import fitz; d=fitz.open('tests/sample_files/invoice_indihome.pdf'); print(d[0].get_text())\"")

    if filename.endswith(".jpg") or filename.endswith(".png"):
        if actual != "image_ocr":
            print("    PENYEBAB: MIME type gambar tidak terdeteksi dengan benar oleh libmagic")
            print("    CHECK   : python3 -c \"import magic; print(magic.from_file('tests/sample_files/struk_restoran.jpg', mime=True))\"")

    if filename.endswith(".docx") or filename.endswith(".xlsx"):
        if actual != "document":
            print("    PENYEBAB: MIME type Office tidak terdeteksi (libmagic → octet-stream)")
            print("    SOLUSI  : Pastikan fallback extension detection di router.py aktif")
            print("    CHECK   : python3 -c \"import magic; print(magic.from_file('tests/sample_files/belanja_april.docx', mime=True))\"")


def _debug_empty_text(filename: str, data: dict):
    print(f"\n  {YELLOW}[DEBUG SKENARIO – TEKS KOSONG]{RESET}")
    engine = data.get("engine_used", "?")

    if "surya" in engine.lower():
        print("    PENYEBAB: Surya OCR tidak mendeteksi teks di gambar")
        print("    Kemungkinan:")
        print("      1. Resolusi gambar terlalu rendah (< 150 DPI)")
        print("      2. Kontras gambar buruk")
        print("      3. Surya model belum fully loaded (lazy init)")
        print("    SOLUSI  :")
        print("      → Buka gambar dan cek: open tests/sample_files/struk_restoran.jpg")
        print("      → Coba jalankan Surya langsung:")
        print("        cd apps/ocr && python3 -c \"")
        print("          from engines.surya_engine import surya_engine")
        print("          r = surya_engine.extract('tests/sample_files/struk_restoran.jpg')")
        print("          print(r)\"")
        print("      → Jika model belum download: pip install surya-ocr && python -c 'from surya.recognition import RecognitionPredictor; RecognitionPredictor()'")

    elif "pymupdf" in engine.lower():
        print("    PENYEBAB: PDF tidak memiliki layer teks selectable")
        print("    SOLUSI  : Regenerate invoice_indihome.pdf dengan fpdf2")

    elif "docx" in filename or "xlsx" in filename:
        print("    PENYEBAB: File tidak memiliki konten teks")
        print("    SOLUSI  : Cek isi file:")
        print(f"      python3 -c \"from docx import Document; d=Document('tests/sample_files/{filename}'); print([p.text for p in d.paragraphs])\"")


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Debug test all sample files against OCR API")
    parser.add_argument("--url",     default=os.getenv("OCR_BASE_URL", "http://localhost:8000"))
    parser.add_argument("--key",     default=os.getenv("OCR_API_KEY",  "dev-secret-key"))
    parser.add_argument("--file",    default=None, help="Hanya test 1 file tertentu")
    parser.add_argument("--verbose", action="store_true", help="Print full teks hasil ekstraksi")
    args = parser.parse_args()

    print(f"\n{BOLD}{'='*55}{RESET}")
    print(f"{BOLD}  DEBUG: tests/sample_files → OCR API{RESET}")
    print(f"{BOLD}{'='*55}{RESET}")
    print(f"  URL     : {args.url}")
    print(f"  API Key : {args.key[:6]}..." if len(args.key) > 6 else f"  API Key : {args.key}")
    print(f"  Samples : {SAMPLE_DIR}")

    # Health check
    if not check_health(args.url):
        sys.exit(1)

    # Pilih file yang akan ditest
    if args.file:
        files_to_test = [args.file]
    else:
        files_to_test = list(EXPECTED.keys())

    # Run tests
    results = []
    for fname in files_to_test:
        r = test_file(fname, args.url, args.key, args.verbose)
        results.append(r)

    # Summary
    print(f"\n{BOLD}{'='*55}{RESET}")
    print(f"{BOLD}  SUMMARY{RESET}")
    print(f"{'='*55}")

    passed = sum(1 for r in results if r["passed"])
    total  = len(results)

    for r in results:
        icon = f"{GREEN}✓{RESET}" if r["passed"] else f"{RED}✗{RESET}"
        errors_str = ", ".join(r["errors"]) if r["errors"] else "—"
        print(f"  {icon}  {r['file']:<30} {errors_str}")

    print(f"\n  Total: {passed}/{total} passed")

    if passed < total:
        print(f"\n{YELLOW}  Jalankan dengan --verbose untuk melihat hasil ekstraksi penuh{RESET}")
        print(f"  Contoh: python tests/debug_sample_files.py --file kwitansi_scan.pdf --verbose")
        sys.exit(1)
    else:
        print(f"\n{GREEN}{BOLD}  Semua file lolos! 🎉{RESET}")
        sys.exit(0)


if __name__ == "__main__":
    main()
