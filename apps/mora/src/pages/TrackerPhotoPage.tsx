import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '../layouts/BaseLayout';
import { Icon } from '../components/ui/Icon';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { getPerspectiveTransform, applyHomography } from '../utils/perspectiveUtils';

type Point = { x: number; y: number };
type Line = { theta: number; rho: number; votes: number };

function dist(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function toGrayscale(imgData: ImageData, w: number, h: number): Uint8Array {
  const d = imgData.data;
  const g = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++)
    g[i] = (d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114) | 0;
  return g;
}

function gaussianBlur5(gray: Uint8Array, w: number, h: number): Uint8Array {
  const k = [2, 4, 5, 4, 2, 4, 9, 12, 9, 4, 5, 12, 15, 12, 5, 4, 9, 12, 9, 4, 2, 4, 5, 4, 2];
  const kSum = 159;
  const out = new Uint8Array(w * h);
  for (let y = 2; y < h - 2; y++) {
    for (let x = 2; x < w - 2; x++) {
      let s = 0, ki = 0;
      for (let dy = -2; dy <= 2; dy++)
        for (let dx = -2; dx <= 2; dx++, ki++)
          s += gray[(y + dy) * w + (x + dx)] * k[ki];
      out[y * w + x] = (s / kSum) | 0;
    }
  }
  return out;
}

function sobelEdge(gray: Uint8Array, w: number, h: number, threshold = 40): Uint8Array {
  const out = new Uint8Array(w * h);
  const kx = [-1, 0, 1, -2, 0, 2, -1, 0, 1], ky = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let gx = 0, gy = 0, k = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++, k++) {
          const v = gray[(y + dy) * w + (x + dx)];
          gx += v * kx[k]; gy += v * ky[k];
        }
      out[y * w + x] = Math.sqrt(gx * gx + gy * gy) > threshold ? 255 : 0;
    }
  }
  return out;
}

function dilate(edge: Uint8Array, w: number, h: number, radius = 1): Uint8Array {
  const out = new Uint8Array(w * h);
  for (let y = radius; y < h - radius; y++)
    for (let x = radius; x < w - radius; x++) {
      let found = false;
      outer: for (let dy = -radius; dy <= radius; dy++)
        for (let dx = -radius; dx <= radius; dx++)
          if (edge[(y + dy) * w + (x + dx)]) { found = true; break outer; }
      if (found) out[y * w + x] = 255;
    }
  return out;
}

function erode(mask: Uint8Array, w: number, h: number, radius = 1): Uint8Array {
  const out = new Uint8Array(w * h);
  for (let y = radius; y < h - radius; y++)
    for (let x = radius; x < w - radius; x++) {
      let allSet = true;
      outer: for (let dy = -radius; dy <= radius; dy++)
        for (let dx = -radius; dx <= radius; dx++)
          if (!mask[(y + dy) * w + (x + dx)]) { allSet = false; break outer; }
      if (allSet) out[y * w + x] = 255;
    }
  return out;
}

function sharpen(gray: Uint8Array, w: number, h: number): Uint8Array {
  const out = new Uint8Array(w * h);
  const k = [0, -1, 0, -1, 5, -1, 0, -1, 0];
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      let s = 0, ki = 0;
      for (let dy = -1; dy <= 1; dy++)
        for (let dx = -1; dx <= 1; dx++, ki++)
          s += gray[(y + dy) * w + (x + dx)] * k[ki];
      out[y * w + x] = clamp(s, 0, 255);
    }
  return out;
}

function otsuThreshold(gray: Uint8Array, w: number, h: number): number {
  const hist = new Int32Array(256);
  for (let i = 0; i < w * h; i++) hist[gray[i]]++;
  const total = w * h;
  let sumAll = 0;
  for (let t = 0; t < 256; t++) sumAll += t * hist[t];
  let sumB = 0, wB = 0, maxVar = 0, thresh = 128;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (!wB) continue;
    const wF = total - wB;
    if (!wF) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sumAll - sumB) / wF;
    const between = wB * wF * (mB - mF) ** 2;
    if (between > maxVar) { maxVar = between; thresh = t; }
  }
  return thresh;
}

function buildBrightMask(gray: Uint8Array, w: number, h: number): Uint8Array {
  const t = otsuThreshold(gray, w, h);
  const effectiveT = Math.max(t - 15, 80);
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) mask[i] = gray[i] >= effectiveT ? 255 : 0;
  return mask;
}

function largestConnectedComponent(mask: Uint8Array, w: number, h: number): Uint8Array {
  const labels = new Int32Array(w * h).fill(-1);
  let nextLabel = 0;
  const sizes: number[] = [];

  for (let sy = 0; sy < h; sy++) {
    for (let sx = 0; sx < w; sx++) {
      if (!mask[sy * w + sx] || labels[sy * w + sx] >= 0) continue;
      const label = nextLabel++;
      const stack = [sy * w + sx];
      let size = 0;
      while (stack.length) {
        const idx = stack.pop()!;
        if (labels[idx] >= 0) continue;
        labels[idx] = label;
        size++;
        const x = idx % w, y = (idx / w) | 0;
        if (x > 0 && mask[idx - 1] && labels[idx - 1] < 0) stack.push(idx - 1);
        if (x < w - 1 && mask[idx + 1] && labels[idx + 1] < 0) stack.push(idx + 1);
        if (y > 0 && mask[idx - w] && labels[idx - w] < 0) stack.push(idx - w);
        if (y < h - 1 && mask[idx + w] && labels[idx + w] < 0) stack.push(idx + w);
      }
      sizes[label] = size;
    }
  }

  if (!sizes.length) return new Uint8Array(w * h);

  const borderLabels = new Set<number>();
  for (let x = 0; x < w; x++) {
    const tl = labels[x]; if (tl >= 0) borderLabels.add(tl);
    const bl = labels[(h - 1) * w + x]; if (bl >= 0) borderLabels.add(bl);
  }
  for (let y = 0; y < h; y++) {
    const ll = labels[y * w]; if (ll >= 0) borderLabels.add(ll);
    const rl = labels[y * w + w - 1]; if (rl >= 0) borderLabels.add(rl);
  }

  let bestLabel = -1, bestSize = 0;
  for (let l = 0; l < nextLabel; l++) {
    if (!borderLabels.has(l) && sizes[l] > bestSize) {
      bestSize = sizes[l];
      bestLabel = l;
    }
  }

  if (bestLabel < 0) {
    const sorted = sizes
      .map((s, i) => ({ s, i }))
      .filter(({ i }) => !borderLabels.has(i))
      .sort((a, b) => b.s - a.s);
    if (sorted.length) bestLabel = sorted[0].i;
  }
  if (bestLabel < 0) return new Uint8Array(w * h);

  const out = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) if (labels[i] === bestLabel) out[i] = 255;
  return out;
}

function blobCorners(blob: Uint8Array, w: number, h: number): Point[] | null {
  let tlIdx = -1, trIdx = -1, brIdx = -1, blIdx = -1;
  let tlV = Infinity, trV = -Infinity, brV = -Infinity, blV = Infinity;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!blob[y * w + x]) continue;
      const s = x + y, d = x - y;
      if (s < tlV) { tlV = s; tlIdx = y * w + x; }
      if (d > trV) { trV = d; trIdx = y * w + x; }
      if (s > brV) { brV = s; brIdx = y * w + x; }
      if (d < blV) { blV = d; blIdx = y * w + x; }
    }
  }

  if (tlIdx < 0 || trIdx < 0 || brIdx < 0 || blIdx < 0) return null;
  const toPoint = (idx: number): Point => ({ x: idx % w, y: (idx / w) | 0 });
  return [toPoint(tlIdx), toPoint(trIdx), toPoint(brIdx), toPoint(blIdx)];
}

function convexHull(pts: Point[]): Point[] {
  if (pts.length < 3) return pts;
  pts = [...pts].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (O: Point, A: Point, B: Point) =>
    (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
  const lower: Point[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
      lower.pop();
    lower.push(p);
  }
  const upper: Point[] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
      upper.pop();
    upper.push(p);
  }
  upper.pop(); lower.pop();
  return lower.concat(upper);
}

function fitQuadFromBlob(blob: Uint8Array, w: number, h: number): Point[] | null {
  const boundary: Point[] = [];
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++)
      if (blob[y * w + x] &&
        (!blob[(y - 1) * w + x] || !blob[(y + 1) * w + x] ||
          !blob[y * w + x - 1] || !blob[y * w + x + 1]))
        boundary.push({ x, y });

  if (boundary.length < 10) return null;

  const step = Math.max(1, Math.floor(boundary.length / 800));
  const sampled = boundary.filter((_, i) => i % step === 0);
  const hull = convexHull(sampled);
  if (hull.length < 4) return null;

  const corners = blobCorners(blob, w, h);
  if (!corners) return null;

  const refined = corners.map((c) => {
    let best = c, bestD = Infinity;
    for (const hp of hull) {
      const d = dist(hp, c);
      if (d < bestD) { bestD = d; best = hp; }
    }
    return best;
  });

  return refined;
}

function houghTransform(edges: Uint8Array, w: number, h: number): Line[] | null {
  const diag = Math.ceil(Math.hypot(w, h));
  const tSteps = 360;
  const rMax = diag;
  const acc = new Int32Array(tSteps * (2 * rMax + 1));
  const cosA: number[] = [], sinA: number[] = [];
  for (let t = 0; t < tSteps; t++) {
    cosA[t] = Math.cos((t * Math.PI) / tSteps);
    sinA[t] = Math.sin((t * Math.PI) / tSteps);
  }
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      if (!edges[y * w + x]) continue;
      for (let t = 0; t < tSteps; t++) {
        const rho = Math.round(x * cosA[t] + y * sinA[t]) + rMax;
        if (rho >= 0 && rho < 2 * rMax + 1) acc[t * (2 * rMax + 1) + rho]++;
      }
    }
  const threshold = Math.max(w, h) * 0.12;
  const lines: Line[] = [];
  for (let t = 0; t < tSteps; t++)
    for (let r = 0; r < 2 * rMax + 1; r++)
      if (acc[t * (2 * rMax + 1) + r] > threshold)
        lines.push({ theta: (t * Math.PI) / tSteps, rho: r - rMax, votes: acc[t * (2 * rMax + 1) + r] });
  return clusterLines(lines, w, h);
}

function clusterLines(lines: Line[], w: number, h: number): Line[] | null {
  if (!lines.length) return null;
  const used = new Array(lines.length).fill(false);
  const clusters: Line[] = [];
  const angleThresh = 0.12;
  const rhoThresh = Math.max(w, h) * 0.05;
  for (let i = 0; i < lines.length; i++) {
    if (used[i]) continue;
    const cl = [lines[i]];
    for (let j = i + 1; j < lines.length; j++) {
      if (used[j]) continue;
      const dTheta = Math.min(
        Math.abs(lines[i].theta - lines[j].theta),
        Math.PI - Math.abs(lines[i].theta - lines[j].theta)
      );
      if (dTheta < angleThresh && Math.abs(lines[i].rho - lines[j].rho) < rhoThresh) {
        cl.push(lines[j]); used[j] = true;
      }
    }
    const avg = cl.reduce(
      (a, l) => ({ theta: a.theta + l.theta, rho: a.rho + l.rho, votes: a.votes + l.votes }),
      { theta: 0, rho: 0, votes: 0 }
    );
    clusters.push({ theta: avg.theta / cl.length, rho: avg.rho / cl.length, votes: avg.votes });
  }
  clusters.sort((a, b) => b.votes - a.votes);
  const hlines = clusters.filter((l) => Math.abs(Math.sin(l.theta)) > 0.5).slice(0, 8);
  const vlines = clusters.filter((l) => Math.abs(Math.cos(l.theta)) > 0.5).slice(0, 8);
  if (hlines.length < 2 || vlines.length < 2) return null;
  hlines.sort((a, b) => a.rho * Math.sign(Math.sin(a.theta)) - b.rho * Math.sign(Math.sin(b.theta)));
  vlines.sort((a, b) => a.rho * Math.sign(Math.cos(a.theta)) - b.rho * Math.sign(Math.cos(b.theta)));
  return [hlines[0], hlines[hlines.length - 1], vlines[0], vlines[vlines.length - 1]];
}

function cornersFromLines(lines: Line[], w: number, h: number): Point[] | null {
  const [h1, h2, v1, v2] = lines;
  const intersect = (l1: Line, l2: Line): Point | null => {
    const det = Math.cos(l1.theta) * Math.sin(l2.theta) - Math.sin(l1.theta) * Math.cos(l2.theta);
    if (Math.abs(det) < 1e-6) return null;
    return {
      x: (l1.rho * Math.sin(l2.theta) - l2.rho * Math.sin(l1.theta)) / det,
      y: (l2.rho * Math.cos(l1.theta) - l1.rho * Math.cos(l2.theta)) / det,
    };
  };
  const pts = [intersect(h1, v1), intersect(h1, v2), intersect(h2, v2), intersect(h2, v1)].filter(
    Boolean
  ) as Point[];
  if (pts.length < 4) return null;
  const pad = Math.min(w, h) * 0.12;
  if (!pts.every((p) => p.x > -pad && p.x < w + pad && p.y > -pad && p.y < h + pad)) return null;
  pts.forEach((p) => { p.x = clamp(p.x, 2, w - 2); p.y = clamp(p.y, 2, h - 2); });
  return pts;
}

function reorderCorners(pts: Point[]): Point[] {
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const sorted = [...pts].sort((a, b) => {
    const angleA = Math.atan2(a.y - cy, a.x - cx);
    const angleB = Math.atan2(b.y - cy, b.x - cx);
    return angleA - angleB;
  });
  let tlIdx = 0;
  let minSum = Infinity;
  for (let i = 0; i < sorted.length; i++) {
    const s = sorted[i].x + sorted[i].y;
    if (s < minSum) { minSum = s; tlIdx = i; }
  }
  const reordered: Point[] = [];
  for (let i = 0; i < 4; i++) reordered.push(sorted[(tlIdx + i) % 4]);
  return reordered;
}

function isValidQuad(pts: Point[], w: number, h: number): boolean {
  if (pts.length < 4) return false;
  const area = Math.abs(
    (pts[0].x * (pts[1].y - pts[3].y) +
      pts[1].x * (pts[2].y - pts[0].y) +
      pts[2].x * (pts[3].y - pts[1].y) +
      pts[3].x * (pts[0].y - pts[2].y)) / 2
  );
  return area > w * h * 0.04;
}

function autoDetectCorners(imgData: ImageData, w: number, h: number): Point[] | null {
  const gray = toGrayscale(imgData, w, h);

  {
    const blurred = gaussianBlur5(gray, w, h);
    const brightMask = buildBrightMask(blurred, w, h);
    const dilated = dilate(brightMask, w, h, 3);
    const closed = erode(dilated, w, h, 3);
    const blob = largestConnectedComponent(closed, w, h);
    const quad = fitQuadFromBlob(blob, w, h);
    if (quad && isValidQuad(quad, w, h)) return reorderCorners(quad);
  }

  {
    const blurred = gaussianBlur5(gray, w, h);
    const edges = sobelEdge(blurred, w, h, 25);
    const dilated = dilate(edges, w, h, 1);
    const lines = houghTransform(dilated, w, h);
    if (lines && lines.length >= 4) {
      const corners = cornersFromLines(lines, w, h);
      if (corners && isValidQuad(corners, w, h)) return reorderCorners(corners);
    }
  }

  {
    const sharp = sharpen(gray, w, h);
    const edges = sobelEdge(sharp, w, h, 15);
    const dilated = dilate(edges, w, h, 2);
    const lines = houghTransform(dilated, w, h);
    if (lines && lines.length >= 4) {
      const corners = cornersFromLines(lines, w, h);
      if (corners && isValidQuad(corners, w, h)) return reorderCorners(corners);
    }
  }

  {
    const blurred = gaussianBlur5(gray, w, h);
    const t = otsuThreshold(blurred, w, h);
    const darkMask = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) darkMask[i] = blurred[i] < t + 10 ? 255 : 0;
    const dilated = dilate(darkMask, w, h, 3);
    const closed = erode(dilated, w, h, 3);
    const blob = largestConnectedComponent(closed, w, h);
    const quad = fitQuadFromBlob(blob, w, h);
    if (quad && isValidQuad(quad, w, h)) return reorderCorners(quad);
  }

  return null;
}

function defaultCorners(w: number, h: number): Point[] {
  const mx = w * 0.12, my = h * 0.12;
  return [
    { x: mx, y: my },
    { x: w - mx, y: my },
    { x: w - mx, y: h - my },
    { x: mx, y: h - my },
  ];
}

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
        <div className="card mb-3 border-0 shadow-sm overflow-hidden">
          <div className="card-body p-4" style={{ border: 'none' }}>
            <div className="d-flex justify-content-between align-items-center position-relative" style={{ minHeight: '40px', border: 'none' }}>
              {/* Connecting Line */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '6px', 
                  left: '16.66%', 
                  right: '16.66%', 
                  height: '2px', 
                  background: '#e6e7e9',
                  zIndex: 0
                }} 
              />
              
              {/* Steps */}
              {[
                { label: 'Scan', id: 1 },
                { label: 'Sesuaikan', id: 2 },
                { label: 'Hasil', id: 3 }
              ].map((s) => (
                <div key={s.id} className="d-flex flex-column align-items-center flex-fill" style={{ zIndex: 1, border: 'none' }}>
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    borderRadius: '50%', 
                    background: step === s.id ? '#f76707' : step > s.id ? '#2fb344' : '#e6e7e9',
                    marginBottom: '8px',
                    transition: 'all 0.3s ease',
                    boxShadow: step === s.id ? '0 0 0 3px rgba(247, 103, 7, 0.2)' : 'none',
                    border: 'none'
                  }} />
                  <span style={{ 
                    fontSize: '12px', 
                    fontWeight: step === s.id ? '600' : '500',
                    color: step === s.id ? '#1d273b' : '#6c7a91',
                    transition: 'all 0.3s ease'
                  }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={`alert mb-3 ${statusType === 'ok' ? 'alert-success' :
              statusType === 'warn' ? 'alert-warning' :
                statusType === 'error' ? 'alert-danger' : 'alert-info'
            }`}
        >
          <div className="d-flex align-items-center">
            <div
              className={`status status-dot ${statusType ? 'status-pulse' : ''} me-2 ${statusType === 'ok' ? 'bg-primary' :
                  statusType === 'warn' ? 'bg-warning' :
                    statusType === 'error' ? 'bg-danger' : 'bg-info'
                }`}
            />
            <div className="small fw-medium">{statusMsg}</div>
          </div>
          {autoCropTimeLeft !== null && (
            <div className="progress progress-xs mt-2" style={{ height: '4px' }}>
              <div
                className="progress-bar bg-primary"
                style={{ width: `${(autoCropTimeLeft / 3) * 100}%`, transition: 'width 1s linear' }}
              />
            </div>
          )}
        </div>

        <div className="card shadow-sm mb-3 overflow-hidden border-0">
          <div className="card-header bg-transparent py-3">
            <div className="d-flex align-items-center gap-2">
              <Icon icon="scan" className="text-primary" size="md" />
              <h3 className="card-title fw-bold m-0">Document Scanner</h3>
              {mode === 'live' && liveDetected && (
                <span className="badge bg-success ms-auto">✓ Dokumen Terdeteksi</span>
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

        <div className="card shadow-sm border-0">
          <div className="card-header border-0 bg-transparent py-2">
            <h3 className="card-title small fw-bold text-uppercase text-muted">Pengaturan</h3>
          </div>
          <div className="list-group list-group-flush">
            <div className="list-group-item bg-transparent py-3">
              <div className="row align-items-center">
                <div className="col">
                  <div className="fw-bold">Auto crop</div>
                  <div className="text-muted small">Potong otomatis setelah terdeteksi</div>
                </div>
                <div className="col-auto">
                  <label className="form-check form-switch m-0">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={isAutoCrop}
                      onChange={(e) => setIsAutoCrop(e.target.checked)}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="list-group-item bg-transparent py-3">
              <div className="row align-items-center">
                <div className="col">
                  <div className="fw-bold">Kamera</div>
                </div>
                <div className="col-auto" style={{ minWidth: '120px' }}>
                  <Select
                    value={cameraFacing}
                    placement="end"
                    onChange={(val) => setCameraFacing(val as 'environment' | 'user')}
                    options={[
                      { value: 'environment', label: 'Belakang' },
                      { value: 'user', label: 'Depan' }
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className="list-group-item bg-transparent py-3">
              <div className="row align-items-center">
                <div className="col">
                  <div className="fw-bold">Format Output</div>
                </div>
                <div className="col-auto" style={{ minWidth: '120px' }}>
                  <Select
                    value={outputFormat}
                    placement="end"
                    onChange={(val) => setOutputFormat(val as 'png' | 'jpeg')}
                    options={[
                      { value: 'png', label: 'PNG' },
                      { value: 'jpeg', label: 'JPEG' }
                    ]}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </BaseLayout>
  );
}