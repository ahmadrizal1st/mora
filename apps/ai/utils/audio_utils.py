import subprocess
import os

def normalize_audio(input_path: str, output_path: str) -> bool:
    """
    Normalizes audio to 16kHz, mono, WAV format using FFmpeg.
    Required for optimal Whisper transcription.
    """
    try:
        # ffmpeg -i input -ar 16000 -ac 1 output.wav
        command = [
            "ffmpeg", "-y",
            "-i", input_path,
            "-ar", "16000",
            "-ac", "1",
            output_path
        ]
        # Run command and suppress output
        subprocess.run(command, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        return os.path.exists(output_path)
    except (subprocess.CalledProcessError, FileNotFoundError):
        return False
