import { useState } from 'react'
import Slider from '@/components/Slider'
import {
  activations,
  activationDerivatives,
  activationLabels,
} from '@/widgets/_math/activation'
import type { ActivationName } from '@/widgets/_math/activation'

const ACTIVATIONS: ActivationName[] = ['sigmoid', 'tanh', 'relu', 'identity']
const W = 360
const H = 220
const X_RANGE = 5
const Y_MIN = -1.6
const Y_MAX = 1.6

function toPx(x: number, y: number): [number, number] {
  const px = ((x + X_RANGE) / (2 * X_RANGE)) * W
  const py = H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H
  return [px, py]
}

function buildPath(fn: (x: number) => number): string {
  const N = 200
  let d = ''
  for (let i = 0; i <= N; i++) {
    const x = -X_RANGE + (i / N) * (2 * X_RANGE)
    const y = Math.max(Y_MIN, Math.min(Y_MAX, fn(x)))
    const [px, py] = toPx(x, y)
    d += (i === 0 ? 'M' : 'L') + px.toFixed(1) + ' ' + py.toFixed(1) + ' '
  }
  return d
}

export default function ActivareSandbox() {
  const [act, setAct] = useState<ActivationName>('sigmoid')
  const [x, setX] = useState(0.5)

  const fn = activations[act]
  const dfn = activationDerivatives[act]
  const y = fn(x)
  const dy = dfn(x)

  const [pxX] = toPx(x, 0)
  const [, pyY] = toPx(0, y)
  const [, pyZero] = toPx(0, 0)

  return (
    <div className="not-prose my-10 border border-line bg-paper">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-5 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          Schemă interactivă · funcții de activare
        </p>
        <select
          value={act}
          onChange={e => setAct(e.target.value as ActivationName)}
          className="border border-line bg-paper px-2 py-1 font-mono text-xs"
          aria-label="Funcție de activare"
        >
          {ACTIVATIONS.map(a => (
            <option key={a} value={a}>
              {activationLabels[a]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-[1fr_auto]">
        <div className="space-y-5 bg-paper p-5">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Punct curent</p>
            <Slider symbol="x" label="Input" value={x} min={-X_RANGE} max={X_RANGE} onChange={setX} />
          </div>

          <div className="border-t border-line pt-5 font-mono text-xs leading-relaxed text-muted">
            <p className="mb-2 font-sans text-[11px] uppercase tracking-[0.2em]">Valori</p>
            <p>
              {activationLabels[act].toLowerCase()}({x.toFixed(2)}) ={' '}
              <span className="text-ink">{y.toFixed(3)}</span>
            </p>
            <p className="mt-1">
              derivata = <span className="text-ink">{dy.toFixed(3)}</span>
            </p>
          </div>

          <div className="border-t border-line pt-5 text-xs leading-relaxed text-muted">
            <p className="font-sans text-[11px] uppercase tracking-[0.2em]">De ce contează derivata</p>
            <p className="mt-2">
              Algoritmii de antrenare folosesc derivata ca să decidă{' '}
              <span className="text-ink">cum să modifice greutățile</span>. Dacă derivata e
              aproape zero pe o zonă mare (cum se întâmplă la sigmoid pentru |x| mare),
              învățarea încetinește dramatic — fenomen numit „vanishing gradient".
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-paper p-5">
          <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">
            f(x) — verde închis · f′(x) — punctat
          </p>
          <svg width={W} height={H} className="border border-line bg-paper">
            <line x1={0} y1={pyZero} x2={W} y2={pyZero} stroke="rgba(0,0,0,0.1)" />
            <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="rgba(0,0,0,0.1)" />

            <path d={buildPath(dfn)} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={1} strokeDasharray="3 3" />
            <path d={buildPath(fn)} fill="none" stroke="black" strokeWidth={1.75} />

            <line x1={pxX} y1={0} x2={pxX} y2={H} stroke="black" strokeOpacity={0.3} strokeDasharray="2 3" />
            <circle cx={pxX} cy={pyY} r={4.5} fill="white" stroke="black" strokeWidth={2} />
          </svg>
          <div
            className="mt-2 flex justify-between font-mono text-[10px] text-muted"
            style={{ width: W }}
          >
            <span>-{X_RANGE}</span>
            <span>0</span>
            <span>+{X_RANGE}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
