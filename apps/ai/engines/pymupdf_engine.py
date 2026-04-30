import fitz  # PyMuPDF

class PyMuPDFEngine:
    @staticmethod
    def extract_text(file_path: str) -> dict:
        """
        Opens a PDF and extracts text. Uses table detection to preserve structure.
        Returns a dict with text, pages, confidence, and type.
        """
        doc = fitz.open(file_path)
        num_pages = len(doc)
        extracted_pages_text = []
        
        for page_num in range(num_pages):
            page = doc.load_page(page_num)
            
            # Try to find tables first
            tabs = page.find_tables()
            table_texts = []
            
            # Extract tables as formatted pipe-separated strings
            for tab in tabs:
                df = tab.to_pandas()
                # Convert to markdown-like format
                table_texts.append(df.to_csv(sep="|", index=False))
            
            # Get regular text blocks for non-tabular content
            blocks = page.get_text("blocks")
            # Filter out blocks that are inside tables to avoid duplicates
            # (Simplification: just get all text if no tables found)
            if not table_texts:
                page_text = page.get_text("text").strip()
            else:
                # Combine tables and blocks (very basic combination)
                page_text = "\n\n".join(table_texts) + "\n\n" + page.get_text("text").strip()
            
            if len(page_text) > 5:
                extracted_pages_text.append(f"--- Page {page_num + 1} ---\n{page_text}")
        
        full_text = "\n\n".join(extracted_pages_text)
        
        if full_text.strip():
            return {
                "text": full_text,
                "pages": num_pages,
                "confidence": 0.99,
                "type": "pdf_text"
            }
        
        return {
            "text": "",
            "pages": num_pages,
            "confidence": 0.0,
            "type": "pdf_scanned"
        }
