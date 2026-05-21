import { useMemo, useState } from 'react'
import Slider from '@/components/Slider'
import {
  TRAINING_POINTS,
  evalPoly,
  fitPolynomial,
  trueF,
  mse,
  mseAgainstTrue,
} from '@/widgets/_math/polyfit'

const W = 440
const H = 280
const X_MIN = -2.6
const X_MAX = 2.6
const Y_MIN = -1.2
const Y_MAX = 1.2

function toPx(x: number, y: number): [number, number] {
  const px = ((x - X_MIN) / (X_MAX - X_MIN)) * W
  const py = H - ((y - Y_MIN) / (Y_MAX - Y_MIN)) * H
  return [px, py]
}

function buildPath(fn: (x: number) => number, n = 200): string {
  let d = ''
  for (let i = 0; i <= n; i++) {
    const x = X_MIN + (i / n) * (X_MAX - X_MIN)
    const y = Math.max(Y_MIN, Math.min(Y_MAX, fn(x)))
    const [px, py] = toPx(x, y)
    d += (i === 0 ? 'M' : 'L') + px.toFixed(1) + ' ' + py.toFixed(1) + ' '
  }
  return d
}

const TRUE_PATH = buildPath(trueF)

export default function PolinomFit() {
  const [degree, setDegree] = useState(3)
  const [showTrue, setShowTrue] = useState(true)

  const xs = TRAINING_POINTS.map(p => p.x)
  const ys = TRAINING_POINTS.map(p => p.y)

  const coeffs = useMemo(() => fitPolynomial(xs, ys, degree), [degree, xs, ys])
  const predict = (x: number) => evalPoly(coeffs, x)

  const fitPath = useMemo(() => buildPath(predict), [coeffs])
  const trainMSE = mse(predict, TRAINING_POINTS)
  const testMSE = mseAgainstTrue(predict)

  let diagnostic: string
  if (degree <= 1) diagnostic = 'Underfit — modelul e prea simplu, nu poate urma forma datelor.'
  else if (degree <= 4) diagnostic = 'Potrivire bună — modelul urmează forma reală fără să copieze zgomotul.'
  else if (degree <= 7) diagnostic = 'Începe overfit-ul — curba devine prea „contorsionată".'
  else diagnostic = 'Overfit puternic — modelul trece prin toate punctele de antrenare, dar prezice prost între ele.'

  return (
    <div className="not-prose my-10 border border-line bg-paper">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-5 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          Schemă interactivă · regresie polinomială
        </p>
        <label className="flex items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={showTrue}
            onChange={e => setShowTrue(e.target.checked)}
            className="accent-ink"
          />
          arată funcția adevărată
        </label>
      </div>

      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1fr_auto]">
        <div className="space-y-5 bg-paper p-5">
          <div>
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Complexitatea modelului</p>
            <Slider
              symbol="d"
              label="Gradul polinomului"
              value={degree}
              min={1}
              max={12}
              step={1}
              onChange={v => setDegree(Math.round(v))}
              formatValue={v => v.toFixed(0)}
            />
          </div>

          <div className="border-t border-line pt-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Erori</p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted">Antrenare (MSE)</p>
                <p className="mt-1 font-mono text-base tabular-nums">{trainMSE.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-xs text-muted">Test (MSE)</p>
                <p className="mt-1 font-mono text-base tabular-nums">{testMSE.toFixed(4)}</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Eroarea de <strong className="text-ink">antrenare</strong> = cât de prost potrivește
              modelul punctele văzute. Eroarea de <strong className="text-ink">test</strong> = cât de
              prost prezice valori noi (calculată față de funcția adevărată).
            </p>
          </div>

          <div className="border-t border-line pt-5">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Diagnostic</p>
            <p className="mt-2 text-sm leading-relaxed">{diagnostic}</p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-paper p-5">
          <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">
            Punctele de antrenare + curba modelului
          </p>
          <svg width={W} height={H} className="border border-line bg-paper">
            <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="rgba(0,0,0,0.08)" />
            <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="rgba(0,0,0,0.08)" />

            {showTrue && (
              <path d={TRUE_PATH} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth={1} strokeDasharray="4 4" />
            )}
            <path d={fitPath} fill="none" stroke="black" strokeWidth={1.75} />

            {TRAINING_POINTS.map((p, i) => {
              const [px, py] = toPx(p.x, p.y)
              return <circle key={i} cx={px} cy={py} r={4} fill="white" stroke="black" strokeWidth={1.5} />
            })}
          </svg>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-0.5 w-6 bg-ink" />
              Polinom de grad {degree}
            </span>
            {showTrue && (
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-0.5 w-6 border-t border-dashed border-ink" />
                Funcția adevărată
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-full border border-ink bg-paper" />
              Date de antrenare
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
