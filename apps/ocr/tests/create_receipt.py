import os
import fitz  # PyMuPDF

sample_dir = "/Users/macbook/Documents/visatamora/apps/ocr/tests/samples"
os.makedirs(sample_dir, exist_ok=True)

receipt_text = """
TOKOMPEDIA
Invoice: INV/20260427/MPL/12345
Tanggal: 27 April 2026

1x Kopi Susu Gula Aren    Rp 25.000
2x Roti Bakar Cokelat     Rp 30.000
-----------------------------------
Total                     Rp 55.000
Metode Bayar: GoPay
"""

pdf = fitz.open()
page = pdf.new_page()
page.insert_text((50, 50), receipt_text)
pdf.save(os.path.join(sample_dir, "receipt.pdf"))
print("Receipt sample created.")
