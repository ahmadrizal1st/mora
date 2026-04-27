import os
import uuid
from pdf2image import convert_from_path
from services.image_service import ImageService

class PDFService:
    @staticmethod
    def process_scanned_pdf(file_path: str, langs: list = None) -> dict:
        """
        Converts a scanned PDF into images and performs OCR on each page.
        """
        # Create a unique temporary directory for this PDF's pages
        session_id = str(uuid.uuid4())
        temp_page_dir = os.path.join("/tmp/ocr", session_id)
        os.makedirs(temp_page_dir, exist_ok=True)
        
        try:
            # Convert PDF pages to PIL images
            pages = convert_from_path(file_path)
            
            all_text = []
            all_confidences = []
            
            for i, page in enumerate(pages):
                page_filename = os.path.join(temp_page_dir, f"page_{i}.png")
                page.save(page_filename, "PNG")
                
                # Perform OCR on the page image
                res = ImageService.process_image(page_filename, langs)
                
                all_text.append(f"--- Page {i+1} ---\n{res['text']}")
                all_confidences.append(res["confidence"])
                
                # Clean up page image immediately
                if os.path.exists(page_filename):
                    os.remove(page_filename)
            
            avg_confidence = sum(all_confidences) / len(all_confidences) if all_confidences else 0.0
            
            return {
                "text": "\n\n".join(all_text),
                "pages": len(pages),
                "confidence": round(avg_confidence, 4),
                "type": "pdf_ocr",
                "engine_used": "surya-ocr"
            }
            
        except Exception as e:
            return {
                "text": "",
                "pages": 0,
                "confidence": 0.0,
                "type": "pdf_error",
                "error": str(e)
            }
        finally:
            # Clean up session directory
            if os.path.exists(temp_page_dir):
                import shutil
                shutil.rmtree(temp_page_dir)
