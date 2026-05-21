import { useState } from 'react'
import Slider from '@/components/Slider'
import { datasets, datasetLabels } from '@/widgets/_math/datasets'
import type { DatasetKey, Punct2D } from '@/widgets/_math/datasets'

const SIZE = 260
const RANGE = 3
const DATASET_KEYS: DatasetKey[] = ['separabil', 'xor']

function toPx(x: number, y: number): [number, number] {
  return [
    ((x + RANGE) / (2 * RANGE)) * SIZE,
    ((-y + RANGE) / (2 * RANGE)) * SIZE,
  ]
}

export default function PerceptronClasificator() {
  const [w1, setW1] = useState(1)
  const [w2, setW2] = useState(1)
  const [bias, setBias] = useState(0)
  const [datasetKey, setDatasetKey] = useState<DatasetKey>('separabil')

  const data = datasets[datasetKey]

  function classify(p: Punct2D): 0 | 1 {
    return w1 * p.x + w2 * p.y + bias > 0 ? 1 : 0
  }

  const correct = data.filter(p => classify(p) === p.clasa).length

  let line: { x1: number; y1: number; x2: number; y2: number } | null = null
  if (Math.abs(w2) > 0.001) {
    const yLeft = -(w1 * -RANGE + bias) / w2
    const yRight = -(w1 * RANGE + bias) / w2
    const [px1, py1] = toPx(-RANGE, yLeft)
    const [px2, py2] = toPx(RANGE, yRight)
    line = { x1: px1, y1: py1, x2: px2, y2: py2 }
  } else if (Math.abs(w1) > 0.001) {
    const xAt = -bias / w1
    const [px] = toPx(xAt, 0)
    line = { x1: px, y1: 0, x2: px, y2: SIZE }
  }

  return (
    <div className="not-prose my-10 border border-line bg-paper">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-5 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          Schemă interactivă · perceptron clasificator
        </p>
        <select
          value={datasetKey}
          onChange={e => setDatasetKey(e.target.value as DatasetKey)}
          className="border border-line bg-paper px-2 py-1 font-mono text-xs"
          aria-label="Dataset"
        >
          {DATASET_KEYS.map(k => (
            <option key={k} value={k}>
              {datasetLabels[k]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-[1fr_auto]">
        <div className="space-y-5 bg-paper p-5">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Parametri</p>
            <div className="space-y-3">
              <Slider symbol="w₁" label="Greutate 1" value={w1} min={-2} max={2} onChange={setW1} />
              <Slider symbol="w₂" label="Greutate 2" value={w2} min={-2} max={2} onChange={setW2} />
              <Slider symbol="b" label="Bias" value={bias} min={-2} max={2} onChange={setBias} />
            </div>
          </div>

          <div className="border-t border-line pt-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Acuratețe</p>
            <p className="mt-2 font-mono text-xl tabular-nums">
              <span className="text-ink">{correct}</span>
              <span className="text-muted">/{data.length}</span>{' '}
              <span className="ml-1 text-xs font-sans text-muted">puncte corect</span>
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Regula: dacă <span className="font-mono">w₁·x + w₂·y + b &gt; 0</span> →
              clasă 1 (cerc plin). Altfel → clasă 0 (cerc gol).
            </p>
          </div>

          <div className="border-t border-line pt-5 font-mono text-xs leading-relaxed text-muted">
            <p className="mb-1 font-sans text-[11px] uppercase tracking-[0.2em]">Linia de decizie</p>
            <p>{w1.toFixed(2)}·x + {w2.toFixed(2)}·y + {bias.toFixed(2)} = 0</p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-paper p-5">
          <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">
            Planul (x, y) · {datasetLabels[datasetKey]}
          </p>
          <svg width={SIZE} height={SIZE} className="border border-line bg-paper">
            <line x1={SIZE / 2} y1={0} x2={SIZE / 2} y2={SIZE} stroke="rgba(0,0,0,0.08)" />
            <line x1={0} y1={SIZE / 2} x2={SIZE} y2={SIZE / 2} stroke="rgba(0,0,0,0.08)" />

            {line && (
              <line
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="black"
                strokeWidth={1.5}
              />
            )}

            {data.map((p, i) => {
              const [cx, cy] = toPx(p.x, p.y)
              const predicted = classify(p)
              const correct = predicted === p.clasa
              return (
                <g key={i}>
                  {!correct && (
                    <circle cx={cx} cy={cy} r={9} fill="none" stroke="black" strokeWidth={1} strokeDasharray="2 2" />
                  )}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill={p.clasa === 1 ? 'black' : 'white'}
                    stroke="black"
                    strokeWidth={1.25}
                  />
                </g>
              )
            })}
          </svg>
          <div
            className="mt-2 flex justify-between font-mono text-[10px] text-muted"
            style={{ width: SIZE }}
          >
            <span>-{RANGE}</span>
            <span>+{RANGE}</span>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full border border-ink bg-ink" />
              Clasă 1
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full border border-ink bg-paper" />
              Clasă 0
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-full border border-dashed border-ink" />
              Greșit
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
