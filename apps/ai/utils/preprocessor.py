import cv2
import numpy as np

def blur_score(image: np.ndarray) -> float:
    """
    Calculates the blur score of an image using the Variance of Laplacian method.
    Higher score means sharper image, lower means more blur.
    """
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
    return cv2.Laplacian(gray, cv2.CV_64F).var()

def deskew(image: np.ndarray) -> np.ndarray:
    """
    Attempts to straighten (deskew) the image.
    """
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image

    # Invert the image (text should be white for minAreaRect)
    gray = cv2.bitwise_not(gray)
    thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    
    # Find all white pixels
    coords = np.column_stack(np.where(thresh > 0))
    if len(coords) == 0:
        return image
        
    # Find the minimum area rectangle that encloses the white pixels
    angle = cv2.minAreaRect(coords)[-1]
    
    # Correct the angle
    if angle < -45:
        angle = -(90 + angle)
    else:
        angle = -angle
        
    # Rotate the image
    (h, w) = image.shape[:2]
    center = (w // 2, h // 2)
    M = cv2.getRotationMatrix2D(center, angle, 1.0)
    rotated = cv2.warpAffine(image, M, (w, h), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    
    return rotated

def enhance_image(image: np.ndarray, threshold: float = 100.0) -> np.ndarray:
    """
    Applies image enhancement: Grayscale -> Denoise -> Otsu Threshold -> Deskew.
    Deskew is only applied if the blur_score is below the threshold.
    """
    # 1. Grayscale
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image.copy()
        
    # 2. Denoise
    denoised = cv2.fastNlMeansDenoising(gray, None, 10, 7, 21)
    
    # 3. Otsu Threshold (Binarization)
    _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
    
    # 4. Check blur score and apply deskew if needed
    current_blur_score = blur_score(image)
    
    processed = binary
    if current_blur_score < threshold:
        # If blurry, attempt to deskew to help OCR
        processed = deskew(processed)
        
    return processed
