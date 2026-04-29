"""
Test Suite: tests/sample_files → OCR API /api/extract
=========================================================
File yang diuji:
  - struk_restoran.jpg    → image_ocr (Surya)
  - invoice_indihome.pdf  → pdf_text  (PyMuPDF)
  - belanja_april.docx    → document  (python-docx)
  - keanggotaan_gym.xlsx  → document  (openpyxl)
  - kwitansi_scan.pdf     → pdf_ocr   (Surya via PDFService)
"""

import os
import pytest
import requests

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
BASE_URL   = os.getenv("OCR_BASE_URL", "http://localhost:8000")
API_KEY    = os.getenv("OCR_API_KEY",  "dev-secret-key")
SAMPLE_DIR = os.path.join(os.path.dirname(__file__), "sample_files")
TIMEOUT    = 120  # seconds – OCR bisa lambat di CPU


# ─────────────────────────────────────────────
# HELPER
# ─────────────────────────────────────────────
def post_extract(filename: str, language: str = "id") -> requests.Response:
    """Upload satu file ke /api/extract dan kembalikan Response."""
    file_path = os.path.join(SAMPLE_DIR, filename)
    assert os.path.exists(file_path), f"[SETUP ERROR] File tidak ditemukan: {file_path}"

    with open(file_path, "rb") as f:
        return requests.post(
            f"{BASE_URL}/api/extract",
            headers={"X-API-Key": API_KEY},
            files={"file": (filename, f)},
            data={"language": language},
            timeout=TIMEOUT,
        )


def assert_extract_ok(resp: requests.Response, expected_type: str, keywords: list[str]):
    """Validasi respons ekstraksi teks."""
    assert resp.status_code == 200, (
        f"[HTTP {resp.status_code}] Body: {resp.text[:500]}"
    )
    data = resp.json()
    assert data.get("type") == expected_type, (
        f"[TYPE MISMATCH] Expected '{expected_type}', got '{data.get('type')}'"
    )
    extracted = data.get("text", "")
    assert len(extracted.strip()) > 0, "[EMPTY TEXT] Tidak ada teks yang diekstrak"
    for kw in keywords:
        assert kw.lower() in extracted.lower(), (
            f"[KEYWORD MISSING] '{kw}' tidak ditemukan dalam teks yang diekstrak.\n"
            f"Teks hasil: {extracted[:300]}"
        )


# ─────────────────────────────────────────────
# FIXTURES
# ─────────────────────────────────────────────
@pytest.fixture(scope="session", autouse=True)
def check_api_alive():
    """Pastikan OCR API berjalan sebelum semua tes."""
    try:
        r = requests.get(f"{BASE_URL}/api/health", timeout=5)
        assert r.status_code == 200 and r.json().get("status") in ("ok", "degraded"), (
            f"[HEALTH CHECK FAIL] Status: {r.status_code}, Body: {r.text}"
        )
    except requests.exceptions.ConnectionError:
        pytest.skip(
            f"OCR API tidak dapat dijangkau di {BASE_URL}. "
            "Jalankan: uvicorn main:app --host 0.0.0.0 --port 8000"
        )


@pytest.fixture(scope="session", autouse=True)
def check_sample_files():
    """Verifikasi semua sample file ada sebelum test dimulai."""
    required = [
        "struk_restoran.jpg",
        "invoice_indihome.pdf",
        "belanja_april.docx",
        "keanggotaan_gym.xlsx",
        "kwitansi_scan.pdf",
    ]
    missing = [f for f in required if not os.path.exists(os.path.join(SAMPLE_DIR, f))]
    if missing:
        pytest.skip(
            f"[MISSING FILES] Jalankan tests/sample_generator.py terlebih dahulu.\n"
            f"File yang hilang: {missing}"
        )


# ─────────────────────────────────────────────
# TEST CASES
# ─────────────────────────────────────────────

class TestImageOCR:
    """TC-01 · struk_restoran.jpg → image_ocr via Surya Engine"""

    def test_status_200(self):
        resp = post_extract("struk_restoran.jpg")
        assert resp.status_code == 200, f"[HTTP {resp.status_code}] {resp.text[:300]}"

    def test_type_is_image_ocr(self):
        resp = post_extract("struk_restoran.jpg")
        data = resp.json()
        assert data.get("type") == "image_ocr", (
            f"[TYPE MISMATCH] Ekspektasi 'image_ocr', dapat '{data.get('type')}'"
        )

    def test_text_not_empty(self):
        resp = post_extract("struk_restoran.jpg")
        data = resp.json()
        assert len(data.get("text", "").strip()) > 0, "[EMPTY] Surya tidak mengekstrak teks apapun"

    def test_keywords_present(self):
        resp = post_extract("struk_restoran.jpg")
        # Surya OCR pada CPU kadang memotong kata panjang; pakai keyword yang lebih pendek
        assert_extract_ok(resp, "image_ocr", ["GORENG", "TOTAL", "30.000"])

    def test_confidence_reasonable(self):
        resp = post_extract("struk_restoran.jpg")
        confidence = resp.json().get("confidence", 0)
        assert confidence >= 0.5, f"[LOW CONFIDENCE] Confidence terlalu rendah: {confidence}"

    def test_engine_is_surya(self):
        resp = post_extract("struk_restoran.jpg")
        engine = resp.json().get("engine_used", "")
        assert "surya" in engine.lower(), f"[ENGINE MISMATCH] Engine yang digunakan: {engine}"


class TestPDFText:
    """TC-02 · invoice_indihome.pdf → pdf_text via PyMuPDF"""

    def test_status_200(self):
        resp = post_extract("invoice_indihome.pdf")
        assert resp.status_code == 200, f"[HTTP {resp.status_code}] {resp.text[:300]}"

    def test_type_is_pdf_text(self):
        resp = post_extract("invoice_indihome.pdf")
        data = resp.json()
        assert data.get("type") == "pdf_text", (
            f"[TYPE MISMATCH] Ekspektasi 'pdf_text', dapat '{data.get('type')}'"
        )

    def test_text_not_empty(self):
        resp = post_extract("invoice_indihome.pdf")
        assert len(resp.json().get("text", "").strip()) > 0, "[EMPTY] Tidak ada teks dari PDF"

    def test_keywords_present(self):
        resp = post_extract("invoice_indihome.pdf")
        assert_extract_ok(resp, "pdf_text", ["IndiHome", "250.000", "INVOICE"])

    def test_engine_is_pymupdf(self):
        resp = post_extract("invoice_indihome.pdf")
        engine = resp.json().get("engine_used", "")
        assert "pymupdf" in engine.lower(), f"[ENGINE MISMATCH] Engine yang digunakan: {engine}"


class TestDocxExtraction:
    """TC-03 · belanja_april.docx → document via DocumentService"""

    def test_status_200(self):
        resp = post_extract("belanja_april.docx")
        assert resp.status_code == 200, f"[HTTP {resp.status_code}] {resp.text[:300]}"

    def test_type_is_document(self):
        resp = post_extract("belanja_april.docx")
        data = resp.json()
        assert data.get("type") == "document", (
            f"[TYPE MISMATCH] Ekspektasi 'document', dapat '{data.get('type')}'"
        )

    def test_text_not_empty(self):
        resp = post_extract("belanja_april.docx")
        assert len(resp.json().get("text", "").strip()) > 0, "[EMPTY] Tidak ada teks dari DOCX"

    def test_keywords_present(self):
        resp = post_extract("belanja_april.docx")
        assert_extract_ok(resp, "document", ["Indomaret", "121.000", "Laporan Belanja"])

    def test_confidence_is_1(self):
        resp = post_extract("belanja_april.docx")
        confidence = resp.json().get("confidence", 0)
        assert confidence == 1.0, f"[CONFIDENCE ERROR] Ekspektasi 1.0, dapat {confidence}"


class TestXlsxExtraction:
    """TC-04 · keanggotaan_gym.xlsx → document via DocumentService"""

    def test_status_200(self):
        resp = post_extract("keanggotaan_gym.xlsx")
        assert resp.status_code == 200, f"[HTTP {resp.status_code}] {resp.text[:300]}"

    def test_type_is_document(self):
        resp = post_extract("keanggotaan_gym.xlsx")
        data = resp.json()
        assert data.get("type") == "document", (
            f"[TYPE MISMATCH] Ekspektasi 'document', dapat '{data.get('type')}'"
        )

    def test_text_not_empty(self):
        resp = post_extract("keanggotaan_gym.xlsx")
        assert len(resp.json().get("text", "").strip()) > 0, "[EMPTY] Tidak ada teks dari XLSX"

    def test_keywords_present(self):
        resp = post_extract("keanggotaan_gym.xlsx")
        assert_extract_ok(resp, "document", ["FitLife", "350000", "Membership"])


class TestPDFScan:
    """TC-05 · kwitansi_scan.pdf → pdf_ocr via Surya + PDFService"""

    def test_status_200(self):
        resp = post_extract("kwitansi_scan.pdf")
        assert resp.status_code == 200, f"[HTTP {resp.status_code}] {resp.text[:300]}"

    def test_type_is_pdf_ocr(self):
        resp = post_extract("kwitansi_scan.pdf")
        data = resp.json()
        assert data.get("type") == "pdf_ocr", (
            f"[TYPE MISMATCH] Ekspektasi 'pdf_ocr', dapat '{data.get('type')}'"
        )

    def test_text_not_empty(self):
        resp = post_extract("kwitansi_scan.pdf")
        assert len(resp.json().get("text", "").strip()) > 0, "[EMPTY] Surya tidak mengekstrak teks dari PDF scan"

    def test_keywords_present(self):
        resp = post_extract("kwitansi_scan.pdf")
        assert_extract_ok(resp, "pdf_ocr", ["KWITANSI", "300.000", "Budi"])

    def test_engine_contains_surya(self):
        resp = post_extract("kwitansi_scan.pdf")
        engine = resp.json().get("engine_used", "")
        assert "surya" in engine.lower(), f"[ENGINE MISMATCH] Engine yang digunakan: {engine}"

    def test_page_count_positive(self):
        resp = post_extract("kwitansi_scan.pdf")
        pages = resp.json().get("pages", 0)
        assert pages >= 1, f"[PAGES ERROR] Halaman harus >= 1, dapat: {pages}"


# ─────────────────────────────────────────────
# BATCH TEST (semua sample sekaligus)
# ─────────────────────────────────────────────
class TestBatchAllSamples:
    """TC-06 · Semua sample dikirim ke /api/extract/batch"""

    SAMPLES = [
        "struk_restoran.jpg",
        "invoice_indihome.pdf",
        "belanja_april.docx",
        "keanggotaan_gym.xlsx",
        "kwitansi_scan.pdf",
    ]

    def test_batch_returns_200(self):
        files = []
        handles = []
        for fname in self.SAMPLES:
            fpath = os.path.join(SAMPLE_DIR, fname)
            h = open(fpath, "rb")
            handles.append(h)
            files.append(("files", (fname, h)))

        try:
            resp = requests.post(
                f"{BASE_URL}/api/extract/batch",
                headers={"X-API-Key": API_KEY},
                files=files,
                data={"language": "id"},
                timeout=300,
            )
        finally:
            for h in handles:
                h.close()

        assert resp.status_code == 200, f"[BATCH HTTP {resp.status_code}] {resp.text[:300]}"

    def test_batch_result_count(self):
        files = []
        handles = []
        for fname in self.SAMPLES:
            fpath = os.path.join(SAMPLE_DIR, fname)
            h = open(fpath, "rb")
            handles.append(h)
            files.append(("files", (fname, h)))

        try:
            resp = requests.post(
                f"{BASE_URL}/api/extract/batch",
                headers={"X-API-Key": API_KEY},
                files=files,
                data={"language": "id"},
                timeout=300,
            )
        finally:
            for h in handles:
                h.close()

        data = resp.json()
        assert data.get("total") == len(self.SAMPLES), (
            f"[BATCH COUNT] Ekspektasi {len(self.SAMPLES)}, dapat {data.get('total')}"
        )
        assert len(data.get("results", [])) == len(self.SAMPLES)

    def test_batch_no_failures(self):
        files = []
        handles = []
        for fname in self.SAMPLES:
            fpath = os.path.join(SAMPLE_DIR, fname)
            h = open(fpath, "rb")
            handles.append(h)
            files.append(("files", (fname, h)))

        try:
            resp = requests.post(
                f"{BASE_URL}/api/extract/batch",
                headers={"X-API-Key": API_KEY},
                files=files,
                data={"language": "id"},
                timeout=300,
            )
        finally:
            for h in handles:
                h.close()

        results = resp.json().get("results", [])
        failed = [r for r in results if not r.get("success")]
        assert len(failed) == 0, (
            f"[BATCH FAILURES] File yang gagal: {[r.get('filename') for r in failed]}"
        )
