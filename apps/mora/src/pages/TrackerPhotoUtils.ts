export type Point = { x: number; y: number };
export type Line = { theta: number; rho: number; votes: number };

export function dist(a: Point, b: Point) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function toGrayscale(imgData: ImageData, w: number, h: number): Uint8Array {
  const d = imgData.data;
  const g = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++)
    g[i] = (d[i * 4] * 0.299 + d[i * 4 + 1] * 0.587 + d[i * 4 + 2] * 0.114) | 0;
  return g;
}

export function gaussianBlur5(gray: Uint8Array, w: number, h: number): Uint8Array {
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

export function sobelEdge(gray: Uint8Array, w: number, h: number, threshold = 40): Uint8Array {
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

export function dilate(edge: Uint8Array, w: number, h: number, radius = 1): Uint8Array {
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

export function erode(mask: Uint8Array, w: number, h: number, radius = 1): Uint8Array {
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

export function sharpen(gray: Uint8Array, w: number, h: number): Uint8Array {
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

export function otsuThreshold(gray: Uint8Array, w: number, h: number): number {
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

export function buildBrightMask(gray: Uint8Array, w: number, h: number): Uint8Array {
  const t = otsuThreshold(gray, w, h);
  const effectiveT = Math.max(t - 15, 80);
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) mask[i] = gray[i] >= effectiveT ? 255 : 0;
  return mask;
}

export function largestConnectedComponent(mask: Uint8Array, w: number, h: number): Uint8Array {
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

export function blobCorners(blob: Uint8Array, w: number, h: number): Point[] | null {
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

export function convexHull(pts: Point[]): Point[] {
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

export function fitQuadFromBlob(blob: Uint8Array, w: number, h: number): Point[] | null {
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

export function houghTransform(edges: Uint8Array, w: number, h: number): Line[] | null {
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

export function clusterLines(lines: Line[], w: number, h: number): Line[] | null {
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

export function cornersFromLines(lines: Line[], w: number, h: number): Point[] | null {
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
  pts.forEach((p) => { 
    p.x = clamp(p.x, w * 0.05, w * 0.95); 
    p.y = clamp(p.y, h * 0.05, h * 0.95); 
  });
  return pts;
}

export function reorderCorners(pts: Point[]): Point[] {
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

export function isValidQuad(pts: Point[], w: number, h: number): boolean {
  if (pts.length < 4) return false;
  const area = Math.abs(
    (pts[0].x * (pts[1].y - pts[3].y) +
      pts[1].x * (pts[2].y - pts[0].y) +
      pts[2].x * (pts[3].y - pts[1].y) +
      pts[3].x * (pts[0].y - pts[2].y)) / 2
  );
  return area > w * h * 0.04;
}

export function autoDetectCorners(imgData: ImageData, w: number, h: number): Point[] | null {
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

export function defaultCorners(w: number, h: number): Point[] {
  const mx = w * 0.12, my = h * 0.12;
  return [
    { x: mx, y: my },
    { x: w - mx, y: my },
    { x: w - mx, y: h - my },
    { x: mx, y: h - my },
  ];
}
