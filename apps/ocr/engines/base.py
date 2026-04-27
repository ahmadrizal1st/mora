from abc import ABC, abstractmethod

class BaseOCREngine(ABC):
    @abstractmethod
    def extract(self, file_path: str) -> dict:
        """
        Abstract method to extract text from a file.
        Should return a dictionary with at least 'text' and 'confidence' keys.
        """
        pass

    @abstractmethod
    def get_status(self) -> dict:
        """
        Returns the current status of the engine.
        """
        pass
