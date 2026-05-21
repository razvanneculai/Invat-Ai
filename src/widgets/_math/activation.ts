export type ActivationName = 'sigmoid' | 'relu' | 'tanh' | 'identity'

export const activations: Record<ActivationName, (x: number) => number> = {
  sigmoid: (x: number) => 1 / (1 + Math.exp(-x)),
  relu: (x: number) => Math.max(0, x),
  tanh: (x: number) => Math.tanh(x),
  identity: (x: number) => x,
}

export const activationDerivatives: Record<ActivationName, (x: number) => number> = {
  sigmoid: (x: number) => {
    const s = 1 / (1 + Math.exp(-x))
    return s * (1 - s)
  },
  relu: (x: number) => (x > 0 ? 1 : 0),
  tanh: (x: number) => 1 - Math.tanh(x) ** 2,
  identity: () => 1,
}

export const activationLabels: Record<ActivationName, string> = {
  sigmoid: 'Sigmoid',
  relu: 'ReLU',
  tanh: 'Tanh',
  identity: 'Identitate',
}

export function normalizeOutput(a: number, activation: ActivationName): number {
  switch (activation) {
    case 'sigmoid':
      return a
    case 'tanh':
      return (a + 1) / 2
    case 'relu':
      return Math.min(1, a / 4)
    case 'identity':
      return Math.min(1, Math.max(0, (a + 4) / 8))
  }
}
