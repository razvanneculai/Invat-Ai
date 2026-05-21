import { useState } from 'react'
import Slider from '@/components/Slider'

const W = 360
const H = 220
const X_MIN = -3
const X_MAX = 5
const Y_MIN = 0
const Y_MAX = 12

function loss(w: number): number {
  return (w - 2) ** 2 + 1
}
function gradient(w: number): number {
  return 2 * (w - 2)
}

function toPx(x: number, y: number): [number, number] {
  const px = ((x - X_MIN) / (X_MAX - X_MIN)) * W
  const py = H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H
  return [px, py]
}

function curvePath(): string {
  const N = 100
  let d = ''
  for (let i = 0; i <= N; i++) {
    const x = X_MIN + (i / N) * (X_MAX - X_MIN)
    const y = Math.min(Y_MAX, loss(x))
    const [px, py] = toPx(x, y)
    d += (i === 0 ? 'M' : 'L') + px.toFixed(1) + ' ' + py.toFixed(1) + ' '
  }
  return d
}

const CURVE = curvePath()

export default function GradientDescent1D() {
  const [w, setW] = useState(-1.5)
  const [lr, setLR] = useState(0.15)
  const [steps, setSteps] = useState(0)

  const L = loss(w)
  const g = gradient(w)
  const [pxW, pyW] = toPx(w, L)

  function step() {
    setW(prev => prev - lr * gradient(prev))
    setSteps(s => s + 1)
  }
  function reset() {
    setW(-1.5)
    setSteps(0)
  }

  return (
    <div className="not-prose my-10 border border-line bg-paper">
      <div className="flex items-baseline justify-between border-b border-line px-5 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          Schemă interactivă · coborârea pe gradient (1D)
        </p>
        <p className="font-mono text-xs text-muted">
          pas <span className="text-ink">{steps}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-[1fr_auto]">
        <div className="space-y-5 bg-paper p-5">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Parametri</p>
            <div className="space-y-3">
              <Slider symbol="w" label="Greutate" value={w} min={X_MIN} max={X_MAX} onChange={v => { setW(v); setSteps(0) }} />
              <Slider symbol="η" label="Rata de învățare (learning rate)" value={lr} min={0.01} max={1} step={0.01} onChange={setLR} />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={step}
              className="border border-ink bg-ink px-4 py-2 text-xs font-medium text-paper transition-colors hover:bg-ink/85"
            >
              Un pas →
            </button>
            <button
              type="button"
              onClick={reset}
              className="border border-line px-4 py-2 text-xs transition-colors hover:border-ink"
            >
              Reset
            </button>
          </div>

          <div className="border-t border-line pt-4 font-mono text-xs leading-relaxed text-muted">
            <p>L(w) = (w − 2)² + 1 = <span className="text-ink">{L.toFixed(3)}</span></p>
            <p className="mt-1">∂L/∂w = 2·(w − 2) = <span className="text-ink">{g.toFixed(3)}</span></p>
            <p className="mt-1">w ← w − η·∂L/∂w = w − {(lr * g).toFixed(3)}</p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-paper p-5">
          <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">
            Loss L(w) — minim la w = 2
          </p>
          <svg width={W} height={H} className="border border-line bg-paper">
            <line x1={0} y1={H - 4} x2={W} y2={H - 4} stroke="rgba(0,0,0,0.1)" />
            <path d={CURVE} fill="none" stroke="black" strokeWidth={1.75} />
            <line x1={pxW} y1={0} x2={pxW} y2={H} stroke="black" strokeOpacity={0.25} strokeDasharray="2 3" />
            <circle cx={pxW} cy={pyW} r={6} fill="black" />
          </svg>
          <div className="mt-2 flex justify-between font-mono text-[10px] text-muted" style={{ width: W }}>
            <span>w = -3</span>
            <span>0</span>
            <span>w = 5</span>
          </div>
        </div>
      </div>
    </div>
  )
}
