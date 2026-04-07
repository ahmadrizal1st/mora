import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '../layouts/BaseLayout';
import { Icon } from '../components/ui/Icon';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getPerspectiveTransform, applyHomography } from '../utils/perspectiveUtils';

import { 
  type Point, 
  dist, 
  clamp, 
  sleep, 
  autoDetectCorners, 
  defaultCorners 
} from './TrackerPhotoUtils';
import { ScannerStepIndicator } from '../components/scanner/ScannerStepIndicator';
import { ScannerStatusAlert } from '../components/scanner/ScannerStatusAlert';
import { ScannerSettings } from '../components/scanner/ScannerSettings';

export default function TrackerPhotoPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const capturedCanvasRef = useRef<HTMLCanvasElement>(null);
  const liveOverlayRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<'live' | 'captured' | 'result'>('live');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [corners, setCorners] = useState<Point[] | null>(null);
  const [capturedData, setCapturedData] = useState<ImageData | null>(null);
  const [statusMsg, setStatusMsg] = useState('Menginisialisasi kamera...');
  const [statusType, setStatusType] = useState<'ok' | 'warn' | 'error' | ''>('warn');
  const [isFlash, setIsFlash] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingLabel, setProcessingLabel] = useState('');
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [isAutoCrop, setIsAutoCrop] = useState(true);
  const [outputFormat, setOutputFormat] = useState<'png' | 'jpeg'>('png');
  const [autoCropTimeLeft, setAutoCropTimeLeft] = useState<number | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [liveDetected, setLiveDetected] = useState(false);
  const [videoAspect, setVideoAspect] = useState(4 / 3);

  const dragging = useRef<number | null>(null);
  const draggingEdge = useRef<number>(-1);
  const dragEdgeStart = useRef<{ corners: Point[]; pointerX: number; pointerY: number } | null>(null);
  const cornersRef = useRef<Point[] | null>(null);
  const capturedWRef = useRef(0);
  const capturedHRef = useRef(0);
  const autoCropIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const liveDetectIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafId = useRef<number | null>(null);
  const cropAndWarpRef = useRef<() => void>(() => { });
  const liveCornersRef = useRef<Point[] | null>(null);

  const drawLiveOverlay = useCallback((pts: Point[] | null, vw: number, vh: number) => {
    const overlay = liveOverlayRef.current;
    if (!overlay) return;
    if (overlay.width !== vw || overlay.height !== vh) {
      overlay.width = vw;
      overlay.height = vh;
    }
    const oc = overlay.getContext('2d');
    if (!oc) return;
    oc.clearRect(0, 0, vw, vh);

    if (!pts || pts.length < 4) {
      const margin = Math.min(vw, vh) * 0.07;
      const x = margin, y = margin;
      const bw = vw - margin * 2, bh = vh - margin * 2;
      const cs = Math.min(vw, vh) * 0.06;
      oc.strokeStyle = '#f76707';
      oc.lineWidth = Math.max(2, vw * 0.003);
      oc.setLineDash([8, 8]);
      oc.beginPath();
      oc.rect(x, y, bw, bh);
      oc.stroke();
      oc.setLineDash([]);
      oc.lineWidth = Math.max(4, vw * 0.006);
      [[x, y, 1, 1], [x + bw, y, -1, 1], [x + bw, y + bh, -1, -1], [x, y + bh, 1, -1]].forEach(
        ([cx, cy, dx, dy]) => {
          oc.beginPath();
          oc.moveTo(cx + dx * cs, cy);
          oc.lineTo(cx, cy);
          oc.lineTo(cx, cy + dy * cs);
          oc.stroke();
        }
      );
      return;
    }

    oc.fillStyle = 'rgba(0,0,0,0.38)';
    oc.fillRect(0, 0, vw, vh);
    oc.save();
    oc.beginPath();
    pts.forEach((c, i) => (i === 0 ? oc.moveTo(c.x, c.y) : oc.lineTo(c.x, c.y)));
    oc.closePath();
    oc.clip();
    oc.clearRect(0, 0, vw, vh);
    oc.restore();

    oc.shadowColor = 'rgba(34,197,94,0.75)';
    oc.shadowBlur = 20;
    oc.strokeStyle = '#22c55e';
    oc.lineWidth = Math.max(3, vw * 0.004);
    oc.setLineDash([]);
    oc.beginPath();
    pts.forEach((c, i) => (i === 0 ? oc.moveTo(c.x, c.y) : oc.lineTo(c.x, c.y)));
    oc.closePath();
    oc.stroke();
    oc.shadowBlur = 0;

    const r = Math.min(vw, vh) * 0.016;
    pts.forEach((c) => {
      oc.beginPath();
      oc.arc(c.x, c.y, r, 0, Math.PI * 2);
      oc.fillStyle = '#22c55e';
      oc.fill();
      oc.strokeStyle = '#ffffff';
      oc.lineWidth = Math.max(2, vw * 0.003);
      oc.stroke();
    });
  }, []);

  const stopLiveDetection = useCallback(() => {
    if (liveDetectIntervalRef.current) {
      clearInterval(liveDetectIntervalRef.current);
      liveDetectIntervalRef.current = null;
    }
  }, []);

  const startLiveDetection = useCallback(() => {
    stopLiveDetection();
    liveDetectIntervalRef.current = setInterval(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) return;
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return;

      const SCALE = Math.min(1, 640 / Math.max(vw, vh));
      const dw = Math.round(vw * SCALE);
      const dh = Math.round(vh * SCALE);
      const tmp = document.createElement('canvas');
      tmp.width = dw;
      tmp.height = dh;
      const ctx = tmp.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, dw, dh);
      const imgData = ctx.getImageData(0, 0, dw, dh);
      const detected = autoDetectCorners(imgData, dw, dh);

      if (detected) {
        const scaled = detected.map((p) => ({ x: p.x / SCALE, y: p.y / SCALE }));
        liveCornersRef.current = scaled;
        setLiveDetected(true);
        drawLiveOverlay(scaled, vw, vh);
      } else {
        liveCornersRef.current = null;
        setLiveDetected(false);
        drawLiveOverlay(null, vw, vh);
      }
    }, 300);
  }, [stopLiveDetection, drawLiveOverlay]);

  const startCamera = useCallback(async () => {
    setStatusMsg('Meminta akses kamera...');
    setStatusType('warn');
    try {
      const video = videoRef.current;
      if (!video) return;
      if (video.srcObject) (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: cameraFacing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        video.play();
        const vw = video.videoWidth || 640;
        const vh = video.videoHeight || 480;
        setVideoAspect(vw / vh);
        setMode('live');
        setStep(1);
        setStatusMsg('Arahkan kamera ke dokumen');
        setStatusType('');
        startLiveDetection();
      };
    } catch {
      setStatusMsg('Kamera tidak dapat diakses — gunakan tombol Upload');
      setStatusType('error');
    }
  }, [cameraFacing, startLiveDetection]);

  useEffect(() => {
    startCamera();
    const video = videoRef.current;
    return () => {
      cancelAnimationFrame(rafId.current!);
      stopLiveDetection();
      if (autoCropIntervalRef.current) clearInterval(autoCropIntervalRef.current);
      if (video?.srcObject) (video.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
    };
  }, [startCamera, stopLiveDetection]);

  const drawCapturedOverlay = useCallback(
    (pts: Point[]) => {
      const canvas = capturedCanvasRef.current;
      if (!canvas || !capturedData) return;
      const w = capturedWRef.current;
      const h = capturedHRef.current;
      canvas.width = w;
      canvas.height = h;
      const oc = canvas.getContext('2d');
      if (!oc) return;
      oc.clearRect(0, 0, w, h);

      const tmp = document.createElement('canvas');
      tmp.width = w;
      tmp.height = h;
      tmp.getContext('2d')?.putImageData(capturedData, 0, 0);
      oc.drawImage(tmp, 0, 0);

      oc.fillStyle = 'rgba(0,0,0,0.55)';
      oc.fillRect(0, 0, w, h);
      oc.save();
      oc.beginPath();
      pts.forEach((c, i) => (i === 0 ? oc.moveTo(c.x, c.y) : oc.lineTo(c.x, c.y)));
      oc.closePath();
      oc.clip();
      oc.drawImage(tmp, 0, 0);
      oc.restore();

      oc.shadowColor = 'rgba(247, 103, 7, 0.6)';
      oc.shadowBlur = 16;
      oc.strokeStyle = '#f76707';
      oc.lineWidth = Math.max(2, w * 0.003);
      oc.beginPath();
      pts.forEach((c, i) => (i === 0 ? oc.moveTo(c.x, c.y) : oc.lineTo(c.x, c.y)));
      oc.closePath();
      oc.stroke();
      oc.shadowBlur = 0;

      const cs = Math.min(w, h) * 0.05;
      const lw = Math.max(3, w * 0.005);
      pts.forEach((c, i) => {
        const prev = pts[(i + 3) % 4];
        const next = pts[(i + 1) % 4];
        const toPrev = { x: prev.x - c.x, y: prev.y - c.y };
        const toNext = { x: next.x - c.x, y: next.y - c.y };
        const lenPrev = Math.hypot(toPrev.x, toPrev.y) || 1;
        const lenNext = Math.hypot(toNext.x, toNext.y) || 1;
        const dp = { x: (toPrev.x / lenPrev) * cs, y: (toPrev.y / lenPrev) * cs };
        const dn = { x: (toNext.x / lenNext) * cs, y: (toNext.y / lenNext) * cs };
        oc.strokeStyle = '#ffffff';
        oc.lineWidth = lw;
        oc.lineCap = 'round';
        oc.shadowColor = 'rgba(247, 103, 7, 0.8)';
        oc.shadowBlur = 6;
        oc.beginPath();
        oc.moveTo(c.x + dp.x, c.y + dp.y);
        oc.lineTo(c.x, c.y);
        oc.lineTo(c.x + dn.x, c.y + dn.y);
        oc.stroke();
        oc.shadowBlur = 0;
      });
    },
    [capturedData]
  );

  useEffect(() => {
    if (mode === 'captured' && corners) drawCapturedOverlay(corners);
  }, [mode, corners, drawCapturedOverlay]);

  const clearAutoCrop = useCallback(() => {
    if (autoCropIntervalRef.current) {
      clearInterval(autoCropIntervalRef.current);
      autoCropIntervalRef.current = null;
    }
    setAutoCropTimeLeft(null);
  }, []);

  const resetToCamera = useCallback(() => {
    clearAutoCrop();
    cancelAnimationFrame(rafId.current!);
    setMode('live');
    setCorners(null);
    cornersRef.current = null;
    setCapturedData(null);
    setResultImage(null);
    setStep(1);
    setLiveDetected(false);
    setStatusMsg('Arahkan kamera ke dokumen');
    setStatusType('');
    startLiveDetection();
  }, [clearAutoCrop, startLiveDetection]);

  const startAutoCropCountdown = useCallback(() => {
    setAutoCropTimeLeft(3);
    autoCropIntervalRef.current = setInterval(() => {
      setAutoCropTimeLeft((prev) => {
        if (prev && prev <= 1) {
          clearInterval(autoCropIntervalRef.current!);
          setTimeout(() => cropAndWarpRef.current(), 0);
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  }, []);

  const captureAndDetect = useCallback(async () => {
    if (mode === 'captured') { resetToCamera(); return; }
    stopLiveDetection();
    cancelAnimationFrame(rafId.current!);
    clearAutoCrop();

    setIsFlash(true);
    await sleep(120);
    setIsFlash(false);

    const video = videoRef.current;
    if (!video) return;
    const w = video.videoWidth || 640;
    const h = video.videoHeight || 480;

    const tmp = document.createElement('canvas');
    tmp.width = w; tmp.height = h;
    tmp.getContext('2d')?.drawImage(video, 0, 0, w, h);
    const imgData = tmp.getContext('2d')?.getImageData(0, 0, w, h);
    if (!imgData) return;

    capturedWRef.current = w;
    capturedHRef.current = h;
    setCapturedData(imgData);
    setMode('captured');
    setStep(2);
    setIsProcessing(true);
    setProcessingLabel('Mendeteksi sudut dokumen...');
    setStatusMsg('Menganalisis tepi dokumen...');
    setStatusType('warn');
    await sleep(60);

    const detected = autoDetectCorners(imgData, w, h);
    setIsProcessing(false);
    const initCorners = detected || defaultCorners(w, h);
    cornersRef.current = initCorners;
    setCorners(initCorners);

    if (detected) {
      setStatusMsg('✓ Dokumen terdeteksi — siap di-crop');
      setStatusType('ok');
      if (isAutoCrop) startAutoCropCountdown();
    } else {
      setStatusMsg('Deteksi otomatis gagal — sesuaikan sudut manual');
      setStatusType('warn');
    }
  }, [mode, isAutoCrop, startAutoCropCountdown, clearAutoCrop, resetToCamera, stopLiveDetection]);

  useEffect(() => {
    const canvas = capturedCanvasRef.current;
    if (!canvas || mode !== 'captured') return;

    const toCanvas = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - r.left) * canvas.width) / r.width,
        y: ((e.clientY - r.top) * canvas.height) / r.height,
      };
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!cornersRef.current) return;
      const { x, y } = toCanvas(e);
      const pts = cornersRef.current;
      const hitRadius = Math.min(capturedWRef.current, capturedHRef.current) * 0.07;

      for (let i = 0; i < 4; i++) {
        if (dist({ x, y }, pts[i]) < hitRadius) {
          e.preventDefault();
          clearAutoCrop();
          dragging.current = i;
          canvas.setPointerCapture(e.pointerId);
          return;
        }
      }

      const edgeHit = Math.min(capturedWRef.current, capturedHRef.current) * 0.06;
      for (let i = 0; i < 4; i++) {
        const a = pts[i], b = pts[(i + 1) % 4];
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        if (dist({ x, y }, { x: mx, y: my }) < edgeHit * 2) {
          e.preventDefault();
          clearAutoCrop();
          draggingEdge.current = i;
          dragEdgeStart.current = { corners: pts.map((p) => ({ ...p })), pointerX: x, pointerY: y };
          canvas.setPointerCapture(e.pointerId);
          return;
        }
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!cornersRef.current) return;
      e.preventDefault();
      const { x, y } = toCanvas(e);

      if (dragging.current !== null) {
        const next = [...cornersRef.current];
        next[dragging.current] = {
          x: clamp(x, 0, capturedWRef.current),
          y: clamp(y, 0, capturedHRef.current),
        };
        cornersRef.current = next;
        drawCapturedOverlay(next);
        return;
      }

      if (draggingEdge.current >= 0 && dragEdgeStart.current) {
        const dx = x - dragEdgeStart.current.pointerX;
        const dy = y - dragEdgeStart.current.pointerY;
        const i = draggingEdge.current;
        const base = dragEdgeStart.current.corners;
        const next = base.map((p) => ({ ...p }));
        next[i] = {
          x: clamp(base[i].x + dx, 0, capturedWRef.current),
          y: clamp(base[i].y + dy, 0, capturedHRef.current),
        };
        next[(i + 1) % 4] = {
          x: clamp(base[(i + 1) % 4].x + dx, 0, capturedWRef.current),
          y: clamp(base[(i + 1) % 4].y + dy, 0, capturedHRef.current),
        };
        cornersRef.current = next;
        drawCapturedOverlay(next);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (dragging.current !== null || draggingEdge.current >= 0) {
        canvas.releasePointerCapture(e.pointerId);
        dragging.current = null;
        draggingEdge.current = -1;
        dragEdgeStart.current = null;
        if (cornersRef.current) setCorners([...cornersRef.current]);
      }
    };

    canvas.addEventListener('pointerdown', onPointerDown, { passive: false });
    canvas.addEventListener('pointermove', onPointerMove, { passive: false });
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
    };
  }, [mode, drawCapturedOverlay, clearAutoCrop]);

  const cropAndWarp = useCallback(async () => {
    clearAutoCrop();
    const pts = cornersRef.current;
    if (!pts || !capturedData) return;
    setIsProcessing(true);
    setProcessingLabel('Meluruskan perspektif...');
    setStatusMsg('Memproses perspektif dokumen...');
    setStatusType('warn');
    await sleep(200);

    const dstW = Math.round(Math.max(dist(pts[0], pts[1]), dist(pts[3], pts[2])));
    const dstH = Math.round(Math.max(dist(pts[0], pts[3]), dist(pts[1], pts[2])));
    const dst = [
      { x: 0, y: 0 },
      { x: dstW, y: 0 },
      { x: dstW, y: dstH },
      { x: 0, y: dstH },
    ];
    const output = document.createElement('canvas');
    output.width = dstW;
    output.height = dstH;
    const outCtx = output.getContext('2d');
    if (!outCtx) { setIsProcessing(false); return; }
    const outData = outCtx.createImageData(dstW, dstH);
    const srcD = capturedData.data;
    const invM = getPerspectiveTransform(dst, pts);

    for (let y = 0; y < dstH; y++)
      for (let x = 0; x < dstW; x++) {
        const [sx, sy] = applyHomography(invM, [x, y]);
        const bx = Math.round(sx), by = Math.round(sy);
        if (bx >= 0 && bx < capturedWRef.current && by >= 0 && by < capturedHRef.current) {
          const si = (by * capturedWRef.current + bx) * 4;
          const di = (y * dstW + x) * 4;
          outData.data[di] = srcD[si];
          outData.data[di + 1] = srcD[si + 1];
          outData.data[di + 2] = srcD[si + 2];
          outData.data[di + 3] = srcD[si + 3];
        }
      }

    outCtx.putImageData(outData, 0, 0);
    const dataUrl = output.toDataURL(`image/${outputFormat}`, outputFormat === 'jpeg' ? 0.92 : undefined);
    setResultImage(dataUrl);
    setMode('result');
    setStep(3);
    setStatusMsg('✓ Dokumen berhasil diproses');
    setStatusType('ok');
    setProcessingLabel('AI sedang membaca struk...');
    setIsProcessing(true);
    await sleep(2000);

    const mockAmount = Math.floor(Math.random() * 500000) + 15000;
    const prefillData = {
      amount: mockAmount,
      date: new Date().toISOString().split('T')[0],
      category: 'food',
      description: 'Scan Struk Otomatis',
      image: dataUrl,
    };
    setIsProcessing(false);
    navigate('/tracker/input', { state: { prefill: prefillData } });
  }, [capturedData, outputFormat, clearAutoCrop, navigate]);

  cropAndWarpRef.current = cropAndWarp;

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = async () => {
      stopLiveDetection();
      cancelAnimationFrame(rafId.current!);
      clearAutoCrop();
      const w = img.width, h = img.height;
      capturedWRef.current = w;
      capturedHRef.current = h;
      const tmp = document.createElement('canvas');
      tmp.width = w; tmp.height = h;
      tmp.getContext('2d')?.drawImage(img, 0, 0);
      const imgData = tmp.getContext('2d')?.getImageData(0, 0, w, h);
      if (!imgData) return;
      setCapturedData(imgData);
      setMode('captured');
      setStep(2);
      setIsProcessing(true);
      setProcessingLabel('Mendeteksi sudut dokumen...');
      setStatusMsg('Menganalisis gambar...');
      setStatusType('warn');
      await sleep(100);
      const detected = autoDetectCorners(imgData, w, h);
      setIsProcessing(false);
      const initCorners = detected || defaultCorners(w, h);
      cornersRef.current = initCorners;
      setCorners(initCorners);
      if (detected) {
        setStatusMsg('✓ Dokumen terdeteksi — siap di-crop');
        setStatusType('ok');
        if (isAutoCrop) startAutoCropCountdown();
      } else {
        setStatusMsg('Atur 4 sudut secara manual');
        setStatusType('warn');
      }
      URL.revokeObjectURL(img.src);
    };
    img.src = URL.createObjectURL(file);
    e.target.value = '';
  };

  return (
    <BaseLayout pageTitle="Receipt Scanner">
      <style dangerouslySetInnerHTML={{ __html: `
        .btn-premium {
          border: 1px solid #e0e0e0 !important;
          background: #fff !important;
          transition: all 0.2s ease !important;
          color: #495057 !important;
        }
        .btn-premium:hover {
          border-color: #9e9e9e !important;
          background-color: #fbfbfb !important;
          color: #212529 !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05) !important;
        }
        .btn-premium-primary {
          border: 1px solid #e0e0e0 !important;
          border-radius: 100px !important;
          background: #fff !important;
          transition: all 0.2s ease !important;
          color: #0054a6 !important;
        }
        .btn-premium-primary:hover {
          border-color: #0054a6 !important;
          background-color: #f0f7ff !important;
          box-shadow: 0 2px 4px rgba(0,84,166,0.1) !important;
        }
      `}} />

      <div className="container-tight py-4">

        {/* Custom Step Indicator - Fixed persistent framework borders/lines */}
        <ScannerStepIndicator step={step} />

        <ScannerStatusAlert 
          statusType={statusType} 
          statusMsg={statusMsg} 
          autoCropTimeLeft={autoCropTimeLeft} 
        />

        <div className="card shadow-sm mb-3 overflow-hidden border-0">
          <div className="card-header bg-transparent py-3">
            <div className="d-flex align-items-center gap-2">
              <Icon icon="scan" className="text-primary" size="md" />
              <h3 className="card-title fw-bold m-0">Document Scanner</h3>
              {mode === 'live' && liveDetected && (
                <Badge color="success" pill className="ms-auto">
                  ✓ Dokumen Terdeteksi
                </Badge>
              )}
            </div>
          </div>

          <div
            ref={wrapperRef}
            className="position-relative bg-black"
            style={{ width: '100%', overflow: 'hidden' }}
          >
            {isFlash && (
              <div
                className="position-absolute top-0 start-0 w-100 h-100"
                style={{ background: '#fff', zIndex: 20, pointerEvents: 'none' }}
              />
            )}

            {isProcessing && (
              <div
                className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center gap-3"
                style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 30 }}
              >
                <div className="spinner-border text-primary" role="status" />
                <div className="text-white small fw-bold">{processingLabel}</div>
              </div>
            )}

            {mode === 'live' && (
              <div
                className="position-relative w-100"
                style={{ aspectRatio: `${videoAspect}` }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'fill',
                    display: 'block',
                  }}
                />
                <canvas
                  ref={liveOverlayRef}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    zIndex: 10,
                  }}
                />
              </div>
            )}

            {mode === 'captured' && capturedData && (
              <div
                className="position-relative w-100"
                style={{ aspectRatio: `${capturedWRef.current / capturedHRef.current}` }}
              >
                <canvas
                  ref={capturedCanvasRef}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    touchAction: 'none',
                    cursor: 'crosshair',
                    zIndex: 10,
                    display: 'block',
                  }}
                />
              </div>
            )}

            {mode === 'result' && resultImage && (
              <div className="w-100 p-2 bg-light">
                <img
                  src={resultImage}
                  alt="Scanned Result"
                  className="w-100 d-block shadow-sm rounded-2"
                  style={{ maxHeight: '70vh', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>

          <div className="card-footer bg-transparent p-3">
            <div className="row g-2">
              {mode === 'live' && (
                <>
                  <div className="col">
                    <Button
                      element="button"
                      onClick={captureAndDetect}
                      color="primary"
                      block
                      className="py-2 fw-bold d-flex align-items-center justify-content-center"
                      icon="camera"
                      size="md"
                    >
                      Ambil Foto
                    </Button>
                  </div>
                  <div className="col-auto">
                    <Button
                      element="button"
                      onClick={handleUploadClick}
                      color="secondary"
                      outline
                      iconOnly
                      icon="upload"
                      iconColor="secondary"
                      size="md"
                      className="py-2 btn-premium"
                      title="Upload Image"
                      style={{ width: '42px', height: '42.5px' }}
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="d-none"
                      onChange={handleFileUpload}
                    />
                  </div>
                </>
              )}
              {mode === 'captured' && (
                <>
                  <div className="col">
                    <Button
                      element="button"
                      onClick={resetToCamera}
                      color="secondary"
                      outline
                      block
                      className="py-2 d-flex align-items-center justify-content-center btn-premium"
                      icon="refresh"
                      iconColor="secondary"
                      size="md"
                    >
                      Ulangi
                    </Button>
                  </div>
                  <div className="col">
                    <Button
                      element="button"
                      onClick={cropAndWarp}
                      color="primary"
                      block
                      className="py-2 fw-bold d-flex align-items-center justify-content-center"
                      icon="focus-centered"
                      size="md"
                    >
                      Luruskan
                    </Button>
                  </div>
                </>
              )}
              {mode === 'result' && resultImage && (
                <>
                  <div className="col">
                    <Button
                      element="button"
                      color="primary" // Reverted to primary solid
                      block
                      className="py-2 fw-bold d-flex align-items-center justify-content-center"
                      icon="check"
                      size="md"
                    >
                      Gunakan Transaksi
                    </Button>
                  </div>
                  <div className="col-auto">
                    <Button
                      element="a"
                      href={resultImage}
                      download={`scan-${Date.now()}.${outputFormat === 'jpeg' ? 'jpg' : 'png'}`}
                      color="secondary"
                      outline
                      iconOnly
                      icon="download"
                      iconColor="secondary"
                      size="md"
                      className="py-2 btn-premium"
                      title="Download"
                      style={{ width: '42px', height: '42.5px' }}
                    />
                  </div>
                  <div className="col-auto">
                    <Button
                      element="button"
                      onClick={resetToCamera}
                      color="secondary"
                      outline
                      iconOnly
                      icon="refresh"
                      iconColor="danger"
                      size="md"
                      className="py-2 btn-premium"
                      title="Reset"
                      style={{ width: '42px', height: '42.5px' }}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <ScannerSettings
          isAutoCrop={isAutoCrop}
          setIsAutoCrop={setIsAutoCrop}
          cameraFacing={cameraFacing}
          setCameraFacing={setCameraFacing}
          outputFormat={outputFormat}
          setOutputFormat={setOutputFormat}
        />

      </div>
    </BaseLayout>
  );
}