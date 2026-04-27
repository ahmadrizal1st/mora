import os
from engines.base import BaseOCREngine
from utils.audio_utils import normalize_audio

class WhisperEngine(BaseOCREngine):
    _model = None

    def _load_model(self):
        """
        Lazy loading of Faster-Whisper model.
        """
        if self._model is None:
            from faster_whisper import WhisperModel
            # As requested: model=small, device=cpu, compute_type=int8
            print("Loading Faster-Whisper model (small) on CPU...")
            self._model = WhisperModel("small", device="cpu", compute_type="int8")

    def extract(self, file_path: str, lang: str = None) -> dict:
        """
        Transcribes audio files (MP3, WAV, M4A, OGG).
        """
        self._load_model()
        
        # 1. Normalize to 16kHz WAV
        temp_wav = f"{file_path}.wav"
        if not normalize_audio(file_path, temp_wav):
            return {
                "text": "", 
                "confidence": 0.0, 
                "engine": "whisper_error",
                "error": "Audio normalization failed"
            }
            
        try:
            # 2. Transcribe
            # beam_size=5 is standard for good quality
            segments, info = self._model.transcribe(temp_wav, beam_size=5, language=lang)
            
            text_parts = []
            for segment in segments:
                text_parts.append(segment.text)
            
            full_text = "".join(text_parts).strip()
            
            return {
                "text": full_text,
                "confidence": round(info.language_probability, 4),
                "engine": "faster-whisper",
                "language": info.language,
                "pages": 1 # For audio, we treat it as 1 'page'
            }
        except Exception as e:
            return {
                "text": "", 
                "confidence": 0.0, 
                "engine": "whisper_error",
                "error": str(e)
            }
        finally:
            if os.path.exists(temp_wav):
                os.remove(temp_wav)

    def get_status(self) -> dict:
        return {
            "name": "Faster-Whisper",
            "status": "ready" if self._model else "idle",
            "loaded": self._model is not None,
            "model": "small",
            "device": "cpu"
        }

# Singleton instance
whisper_engine = WhisperEngine()
