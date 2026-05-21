import { activations } from './activation'
import type { ActivationName } from './activation'

export interface ForwardResult {
  z: number
  a: number
}

export function forward(
  inputs: readonly number[],
  weights: readonly number[],
  bias: number,
  activation: ActivationName,
): ForwardResult {
  let z = bias
  for (let i = 0; i < inputs.length; i++) {
    z += inputs[i] * weights[i]
  }
  const a = activations[activation](z)
  return { z, a }
}
