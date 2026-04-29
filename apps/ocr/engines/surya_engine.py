import os
from PIL import Image
from engines.base import BaseOCREngine

class SuryaEngine(BaseOCREngine):
    _initialized = False
    _det_predictor = None
    _rec_predictor = None

    def __init__(self):
        self.device = "cpu"

    def _load_models(self):
        """
        Lazy loading of Surya OCR models.
        Surya 0.17.x API:
          - RecognitionPredictor(foundation_predictor)
          - rec_predictor(images, task_names=["ocr"], det_predictor=det_predictor)
        """
        if not self.__class__._initialized:
            from surya.detection import DetectionPredictor
            from surya.recognition import RecognitionPredictor
            from surya.foundation import FoundationPredictor

            print("Loading Surya OCR models on CPU...")
            foundation_predictor = FoundationPredictor()
            self.__class__._det_predictor = DetectionPredictor()
            self.__class__._rec_predictor = RecognitionPredictor(foundation_predictor)
            self.__class__._initialized = True
            print("Surya OCR models loaded.")

    def extract(self, file_path: str, langs: list = None) -> dict:
        """
        Performs OCR on an image file using Surya 0.17.x Predictor API.
        The new API: rec_predictor(images, det_predictor=det_predictor)
        `langs` parameter is ignored in the new API (auto-detected).
        """
        try:
            self._load_models()

            image = Image.open(file_path).convert("RGB")

            # Surya 0.17.x: pass det_predictor as keyword argument
            # task_names defaults to None which triggers auto-detection
            results = self.__class__._rec_predictor(
                [image],
                det_predictor=self.__class__._det_predictor,
            )

            if not results or not results[0].text_lines:
                return {"text": "", "confidence": 0.0, "engine": "surya-ocr"}

            ocr_result = results[0]
            
            # Sort lines by Y-coordinate to handle columns better
            # We group lines that have similar Y-top coordinates
            lines = []
            for line in ocr_result.text_lines:
                if not line.text:
                    continue
                # bbox is usually [x1, y1, x2, y2]
                y_top = line.bbox[1]
                lines.append({
                    'text': line.text,
                    'y': y_top,
                    'x': line.bbox[0],
                    'conf': getattr(line, "confidence", 0.85)
                })
            
            # Sort primarily by Y, then by X
            lines.sort(key=lambda l: (l['y'], l['x']))
            
            # Group into horizontal lines with a tolerance (e.g., 15 pixels for receipt lines)
            grouped_lines = []
            if lines:
                current_line = [lines[0]]
                for i in range(1, len(lines)):
                    if abs(lines[i]['y'] - current_line[0]['y']) < 15:
                        current_line.append(lines[i])
                    else:
                        # Sort the finished line by X coordinate
                        current_line.sort(key=lambda l: l['x'])
                        grouped_lines.append(" ".join([l['text'] for l in current_line]))
                        current_line = [lines[i]]
                
                # Add the last line
                current_line.sort(key=lambda l: l['x'])
                grouped_lines.append(" ".join([l['text'] for l in current_line]))

            full_text = "\n".join(grouped_lines)

            # Compute average confidence
            avg_confidence = sum([l['conf'] for l in lines]) / len(lines) if lines else 0.0

            return {
                "text": full_text,
                "confidence": round(avg_confidence, 4),
                "engine": "surya-ocr",
            }

        except Exception as e:
            return {
                "text": "",
                "confidence": 0.0,
                "engine": "surya-ocr",
                "error": str(e),
            }

    def get_status(self) -> dict:
        return {
            "name": "Surya OCR",
            "status": "ready" if self.__class__._initialized else "idle",
            "loaded": self.__class__._initialized,
            "model": "surya",
            "device": self.device,
        }


# Singleton instance for easy reuse
surya_engine = SuryaEngine()
