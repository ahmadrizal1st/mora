import cv2
import os
from engines.surya_engine import surya_engine
from utils.preprocessor import enhance_image

class ImageService:
    @staticmethod
    def process_image(file_path: str, langs: list = None) -> dict:
        """
        Processes an image: Performs OCR, and retries with enhancement if confidence is low.
        """
        # 1. Initial OCR attempt
        result = surya_engine.extract(file_path, langs)
        
        # 2. If confidence is below 0.75, try enhancing the image and re-running OCR
        if result["confidence"] < 0.75:
            img = cv2.imread(file_path)
            if img is not None:
                enhanced_img = enhance_image(img)
                
                # Save temporary enhanced image
                temp_path = f"{file_path}_enhanced.png"
                cv2.imwrite(temp_path, enhanced_img)
                
                try:
                    result_enhanced = surya_engine.extract(temp_path, langs)
                    
                    # Keep the best result
                    if result_enhanced["confidence"] > result["confidence"]:
                        result = result_enhanced
                        result["engine"] = f"{result['engine']}_enhanced"
                finally:
                    if os.path.exists(temp_path):
                        os.remove(temp_path)
                    
        return result
