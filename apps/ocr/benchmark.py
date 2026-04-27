import httpx
import os
import time
import sys

# PRD Targets (ms)
TARGETS = {
    "pdf_text": 2000,
    "image_ocr": 4000,
    "audio_transcription": 8000,
    "document": 1000  # Default target for office docs
}

API_URL = "http://localhost:8000/extract"
API_KEY = "your-secret-api-key" # Default from .env.template

def benchmark_file(client, file_path):
    filename = os.path.basename(file_path)
    print(f"Testing {filename}...", end=" ", flush=True)
    
    with open(file_path, "rb") as f:
        files = {"file": (filename, f)}
        try:
            start_wall = time.time()
            response = client.post(
                API_URL,
                files=files,
                headers={"X-API-Key": API_KEY},
                timeout=30.0
            )
            wall_time_ms = (time.time() - start_wall) * 1000
            
            if response.status_code == 200:
                data = response.json()
                proc_time = data["processing_time_ms"]
                type_ = data["type"]
                
                target = TARGETS.get(type_, 5000)
                status = "PASS" if proc_time < target else "FAIL"
                
                print(f"[{type_}] -> {proc_time}ms (Wall: {wall_time_ms:.1f}ms) -> {status}")
                return {
                    "filename": filename,
                    "type": type_,
                    "proc_time": proc_time,
                    "target": target,
                    "status": status
                }
            else:
                print(f"FAILED (Status {response.status_code}: {response.text})")
                return None
        except Exception as e:
            print(f"ERROR ({str(e)})")
            return None

def main():
    # Use absolute path to locate samples relative to this script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    sample_dir = os.path.join(base_dir, "tests", "samples")
    
    if not os.path.exists(sample_dir):
        print(f"Error: {sample_dir} not found. Please run tests/create_samples.py first.")
        return

    # Get all files in sample dir
    files = [os.path.join(sample_dir, f) for f in os.listdir(sample_dir) 
             if os.path.isfile(os.path.join(sample_dir, f))]
    
    if not files:
        print(f"Error: No files found in {sample_dir}. Please run tests/create_samples.py first.")
        return
    
    # We need 20+ files, so let's repeat the list if needed
    test_queue = files * (20 // len(files) + 1)
    test_queue = test_queue[:25] # Limit to 25 files
    
    results = []
    print(f"Starting benchmark for {len(test_queue)} files...\n")
    
    with httpx.Client() as client:
        for f in test_queue:
            if "large.txt" in f or "empty.txt" in f: continue # Skip error-case files
            res = benchmark_file(client, f)
            if res:
                results.append(res)

    print("\n" + "="*60)
    print(f"{'FILENAME':<20} | {'TYPE':<15} | {'TIME':<8} | {'TARGET':<8} | {'STATUS'}")
    print("-" * 60)
    
    fails = 0
    for r in results:
        flag = "!!!" if r["status"] == "FAIL" else "   "
        print(f"{r['filename']:<20} | {r['type']:<15} | {r['proc_time']:>6.1f}ms | {r['target']:>6}ms | {r['status']} {flag}")
        if r["status"] == "FAIL":
            fails += 1
            
    print("="*60)
    print(f"Summary: {len(results)} tests, {fails} failed targets.")
    if fails > 0:
        print("\nWARNING: Some files did not meet PRD latency targets.")

if __name__ == "__main__":
    main()
