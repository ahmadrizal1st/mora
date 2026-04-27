import os
from PIL import Image
from engines.base import BaseOCREngine

class SuryaEngine(BaseOCREngine):
    _det_model = None
    _det_processor = None
    _rec_model = None
    _rec_processor = None

    def __init__(self):
        self.device = "cpu"

    def _load_models(self):
        """
        Lazy loading of Surya OCR models using the newer Predictor API.
        """
        if self._rec_model is None:
            from surya.detection import DetectionPredictor
            from surya.recognition import RecognitionPredictor
            
            print("Loading Surya OCR models on CPU...")
            self._det_predictor = DetectionPredictor()
            self._rec_predictor = RecognitionPredictor()
            # Set a flag so we don't reload
            self._rec_model = True 

    def extract(self, file_path: str, langs: list = None) -> dict:
        """
        Performs OCR on an image file using Surya Predictors.
        """
        try:
            self._load_models()
            
            if langs is None:
                langs = ["en"]

            image = Image.open(file_path).convert("RGB")
            
            # Predict layout/detection
            predictions = self._det_predictor([image])
            # Predict recognition
            results = self._rec_predictor([image], [langs], predictions)
            
            if not results:
                return {"text": "", "confidence": 0.0, "engine": "surya-ocr"}

            ocr_result = results[0]
            text_lines = [line.text for line in ocr_result.text_lines]
            full_text = "\n".join(text_lines)
            
            # Use average confidence if available
            avg_confidence = getattr(ocr_result, 'confidence', 0.85)
            
            return {
                "text": full_text,
                "confidence": avg_confidence,
                "engine": "surya-ocr"
            }
            
        except Exception as e:
            return {
                "text": "",
                "confidence": 0.0,
                "engine": "surya-ocr",
                "error": str(e)
            }

    def get_status(self) -> dict:
        return {
            "name": "Surya OCR",
            "status": "ready" if self._rec_model else "idle",
            "loaded": self._rec_model is not None,
            "model": "surya",
            "device": self.device
        }

# Singleton instance for easy reuse
surya_engine = SuryaEngine()
