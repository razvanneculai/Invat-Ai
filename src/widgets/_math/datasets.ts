export interface Punct2D {
  x: number
  y: number
  clasa: 0 | 1
}

export type DatasetKey = 'separabil' | 'xor'

export const datasets: Record<DatasetKey, Punct2D[]> = {
  separabil: [
    { x: -1.8, y: 1.6, clasa: 0 },
    { x: -1.2, y: 2.1, clasa: 0 },
    { x: -2.2, y: 1.0, clasa: 0 },
    { x: -0.8, y: 1.4, clasa: 0 },
    { x: -1.5, y: 0.6, clasa: 0 },
    { x: -2.0, y: 1.9, clasa: 0 },
    { x: 1.5, y: -1.6, clasa: 1 },
    { x: 2.1, y: -1.0, clasa: 1 },
    { x: 1.0, y: -2.1, clasa: 1 },
    { x: 1.8, y: -0.6, clasa: 1 },
    { x: 0.8, y: -1.4, clasa: 1 },
    { x: 2.0, y: -1.9, clasa: 1 },
  ],
  xor: [
    { x: 1.3, y: 1.3, clasa: 1 },
    { x: 1.8, y: 1.0, clasa: 1 },
    { x: 1.0, y: 1.8, clasa: 1 },
    { x: -1.3, y: -1.3, clasa: 1 },
    { x: -1.8, y: -1.0, clasa: 1 },
    { x: -1.0, y: -1.8, clasa: 1 },
    { x: 1.3, y: -1.3, clasa: 0 },
    { x: 1.8, y: -1.0, clasa: 0 },
    { x: 1.0, y: -1.8, clasa: 0 },
    { x: -1.3, y: 1.3, clasa: 0 },
    { x: -1.8, y: 1.0, clasa: 0 },
    { x: -1.0, y: 1.8, clasa: 0 },
  ],
}

export const datasetLabels: Record<DatasetKey, string> = {
  separabil: 'Separabil liniar',
  xor: 'XOR (capcană)',
}
