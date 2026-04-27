import fitz  # PyMuPDF

class PyMuPDFEngine:
    @staticmethod
    def extract_text(file_path: str) -> dict:
        """
        Opens a PDF and extracts text if it is selectable.
        Selection criteria: If a page has more than 10 characters, extract it.
        Returns a dict with text, pages, confidence, and type.
        """
        doc = fitz.open(file_path)
        num_pages = len(doc)
        extracted_pages_text = []
        
        for page_num in range(num_pages):
            page = doc.load_page(page_num)
            text = page.get_text().strip()
            
            # Selection criteria: > 10 characters
            if len(text) > 10:
                extracted_pages_text.append(text)
        
        full_text = "\n\n".join(extracted_pages_text)
        
        # If text is successfully extracted, return with high confidence
        if full_text.strip():
            return {
                "text": full_text,
                "pages": num_pages,
                "confidence": 0.99,
                "type": "pdf_text"
            }
        
        # Otherwise return empty/scanned indicator
        return {
            "text": "",
            "pages": num_pages,
            "confidence": 0.0,
            "type": "pdf_scanned"
        }
