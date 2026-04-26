// src/utils/perspectiveUtils.ts
export function dist(p1: {x: number, y: number}, p2: {x: number, y: number}) {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

// Solves Ax = B for Homography
export function getPerspectiveTransform(src: {x: number, y: number}[], dst: {x: number, y: number}[]) {
  const A: number[][] = [];
  const B: number[] = [];
  for (let i = 0; i < 4; i++) {
    A.push([src[i].x, src[i].y, 1, 0, 0, 0, -src[i].x * dst[i].x, -src[i].y * dst[i].x]);
    A.push([0, 0, 0, src[i].x, src[i].y, 1, -src[i].x * dst[i].y, -src[i].y * dst[i].y]);
    B.push(dst[i].x);
    B.push(dst[i].y);
  }

  // Gaussian elimination
  const N = 8;
  for (let i = 0; i < N; i++) {
    // Find pivot
    let maxEl = Math.abs(A[i][i]);
    let maxRow = i;
    for (let k = i + 1; k < N; k++) {
      if (Math.abs(A[k][i]) > maxEl) {
        maxEl = Math.abs(A[k][i]);
        maxRow = k;
      }
    }

    // Swap
    for (let k = i; k < N; k++) {
      const tmp = A[maxRow][k];
      A[maxRow][k] = A[i][k];
      A[i][k] = tmp;
    }
    const tmpB = B[maxRow];
    B[maxRow] = B[i];
    B[i] = tmpB;

    // Eliminate
    for (let k = i + 1; k < N; k++) {
      const c = -A[k][i] / A[i][i];
      for (let j = i; j < N; j++) {
        if (i === j) {
          A[k][j] = 0;
        } else {
          A[k][j] += c * A[i][j];
        }
      }
      B[k] += c * B[i];
    }
  }

  // Back substitution
  const X = new Array(N).fill(0);
  for (let i = N - 1; i >= 0; i--) {
    X[i] = B[i] / A[i][i];
    for (let k = i - 1; k >= 0; k--) {
      B[k] -= A[k][i] * X[i];
    }
  }

  return [...X, 1];
}

export function applyHomography(M: number[], p: [number, number]): [number, number] {
  const x = p[0];
  const y = p[1];
  const w = M[6] * x + M[7] * y + M[8];
  return [
    (M[0] * x + M[1] * y + M[2]) / w,
    (M[3] * x + M[4] * y + M[5]) / w
  ];
}
