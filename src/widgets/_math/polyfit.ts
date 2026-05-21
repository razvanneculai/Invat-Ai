export interface Punct {
  x: number
  y: number
}

export function fitPolynomial(xs: number[], ys: number[], degree: number): number[] {
  const n = xs.length
  const m = degree + 1
  const X: number[][] = []
  for (let i = 0; i < n; i++) {
    const row: number[] = []
    let p = 1
    for (let j = 0; j < m; j++) {
      row.push(p)
      p *= xs[i]
    }
    X.push(row)
  }
  const A: number[][] = []
  const b: number[] = []
  for (let i = 0; i < m; i++) {
    const row: number[] = []
    for (let j = 0; j < m; j++) {
      let s = 0
      for (let k = 0; k < n; k++) s += X[k][i] * X[k][j]
      row.push(s)
    }
    A.push(row)
    let s = 0
    for (let k = 0; k < n; k++) s += X[k][i] * ys[k]
    b.push(s)
  }
  return solveLinear(A, b)
}

function solveLinear(A: number[][], b: number[]): number[] {
  const n = A.length
  const M: number[][] = A.map((row, i) => [...row, b[i]])
  for (let i = 0; i < n; i++) {
    let pivot = i
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[pivot][i])) pivot = k
    }
    if (pivot !== i) {
      const tmp = M[i]
      M[i] = M[pivot]
      M[pivot] = tmp
    }
    if (Math.abs(M[i][i]) < 1e-12) return new Array(n).fill(0)
    for (let k = i + 1; k < n; k++) {
      const f = M[k][i] / M[i][i]
      for (let j = i; j <= n; j++) M[k][j] -= f * M[i][j]
    }
  }
  const x = new Array(n).fill(0)
  for (let i = n - 1; i >= 0; i--) {
    let s = M[i][n]
    for (let j = i + 1; j < n; j++) s -= M[i][j] * x[j]
    x[i] = s / M[i][i]
  }
  return x
}

export function evalPoly(coeffs: number[], x: number): number {
  let s = 0
  for (let i = coeffs.length - 1; i >= 0; i--) s = s * x + coeffs[i]
  return s
}

export function trueF(x: number): number {
  return 0.45 * Math.sin(2 * x)
}

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const TRAINING_POINTS: Punct[] = (() => {
  const rng = mulberry32(11)
  const pts: Punct[] = []
  const N = 14
  for (let i = 0; i < N; i++) {
    const x = -2.2 + (i / (N - 1)) * 4.4
    const noise = (rng() - 0.5) * 0.45
    pts.push({ x, y: trueF(x) + noise })
  }
  return pts
})()

export function mse(pred: (x: number) => number, points: Punct[]): number {
  let s = 0
  for (const p of points) s += (pred(p.x) - p.y) ** 2
  return s / points.length
}

export function mseAgainstTrue(pred: (x: number) => number, xMin = -2.5, xMax = 2.5, step = 0.05): number {
  let s = 0
  let n = 0
  for (let x = xMin; x <= xMax; x += step) {
    s += (pred(x) - trueF(x)) ** 2
    n++
  }
  return s / n
}
