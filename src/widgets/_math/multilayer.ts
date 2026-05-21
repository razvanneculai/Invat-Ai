import { activations } from './activation'

export interface MLPParams {
  w11: number
  w12: number
  b1: number
  w21: number
  w22: number
  b2: number
  v1: number
  v2: number
  c: number
}

export const PRESET_XOR: MLPParams = {
  w11: 3, w12: 3, b1: -3,
  w21: -3, w22: -3, b2: -3,
  v1: 6, v2: 6, c: -3,
}

export const PRESET_ZERO: MLPParams = {
  w11: 0, w12: 0, b1: 0,
  w21: 0, w22: 0, b2: 0,
  v1: 0, v2: 0, c: 0,
}

export interface MLPState {
  h1: number
  h2: number
  y: number
}

export function forwardMLP(x1: number, x2: number, p: MLPParams): MLPState {
  const h1 = activations.sigmoid(p.w11 * x1 + p.w12 * x2 + p.b1)
  const h2 = activations.sigmoid(p.w21 * x1 + p.w22 * x2 + p.b2)
  const y = activations.sigmoid(p.v1 * h1 + p.v2 * h2 + p.c)
  return { h1, h2, y }
}

export function randomMLP(): MLPParams {
  const r = () => +(Math.random() * 8 - 4).toFixed(2)
  return {
    w11: r(), w12: r(), b1: r(),
    w21: r(), w22: r(), b2: r(),
    v1: r(), v2: r(), c: r(),
  }
}
