import { useEffect, useRef, useState } from 'react'
import Slider from '@/components/Slider'
import { forward } from '@/widgets/_math/neuron'
import { activationLabels, normalizeOutput } from '@/widgets/_math/activation'
import type { ActivationName } from '@/widgets/_math/activation'

const ACTIVATIONS: ActivationName[] = ['sigmoid', 'tanh', 'relu', 'identity']
const RANGE = 3
const CANVAS_SIZE = 220

export default function NeuronInteractiv() {
  const [w1, setW1] = useState(1)
  const [w2, setW2] = useState(1)
  const [bias, setBias] = useState(-0.5)
  const [activation, setActivation] = useState<ActivationName>('sigmoid')
  const [x1, setX1] = useState(1)
  const [x2, setX2] = useState(1)

  const { z, a } = forward([x1, x2], [w1, w2], bias, activation)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const img = ctx.createImageData(W, H)

    for (let py = 0; py < H; py++) {
      for (let px = 0; px < W; px++) {
        const xi1 = (px / W) * (2 * RANGE) - RANGE
        const xi2 = -(((py / H) * (2 * RANGE)) - RANGE)
        const { a: out } = forward([xi1, xi2], [w1, w2], bias, activation)
        const intensity = normalizeOutput(out, activation)
        const gray = Math.round((1 - intensity) * 255)
        const idx = (py * W + px) * 4
        img.data[idx] = gray
        img.data[idx + 1] = gray
        img.data[idx + 2] = gray
        img.data[idx + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
  }, [w1, w2, bias, activation])

  const pxX1 = ((x1 + RANGE) / (2 * RANGE)) * CANVAS_SIZE
  const pxX2 = ((-x2 + RANGE) / (2 * RANGE)) * CANVAS_SIZE

  return (
    <div className="not-prose my-10 border border-line bg-paper">
      <div className="flex items-baseline justify-between border-b border-line px-5 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          Schemă interactivă · neuron cu 2 inputuri
        </p>
        <select
          value={activation}
          onChange={e => setActivation(e.target.value as ActivationName)}
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
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Inputuri</p>
            <div className="space-y-3">
              <Slider symbol="x₁" label="Input 1" value={x1} min={-RANGE} max={RANGE} onChange={setX1} />
              <Slider symbol="x₂" label="Input 2" value={x2} min={-RANGE} max={RANGE} onChange={setX2} />
            </div>
          </div>

          <div className="border-t border-line pt-5">
            <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">Parametri neuron</p>
            <div className="space-y-3">
              <Slider symbol="w₁" label="Greutate 1" value={w1} min={-2} max={2} onChange={setW1} />
              <Slider symbol="w₂" label="Greutate 2" value={w2} min={-2} max={2} onChange={setW2} />
              <Slider symbol="b" label="Bias" value={bias} min={-2} max={2} onChange={setBias} />
            </div>
          </div>

          <div className="border-t border-line pt-5 font-mono text-xs leading-relaxed">
            <p className="mb-2 font-sans text-[11px] uppercase tracking-[0.2em] text-muted">
              Calcul
            </p>
            <p className="text-muted">
              z = {w1.toFixed(2)}·{x1.toFixed(2)} + {w2.toFixed(2)}·{x2.toFixed(2)} + {bias.toFixed(2)}
            </p>
            <p className="mt-1">
              z = <span className="text-ink">{z.toFixed(3)}</span>
            </p>
            <p className="mt-1">
              a = {activationLabels[activation].toLowerCase()}(z) ={' '}
              <span className="text-ink">{a.toFixed(3)}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-start bg-paper p-5">
          <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">
            Funcția de decizie pe planul (x₁, x₂)
          </p>
          <div className="relative" style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
            <canvas
              ref={canvasRef}
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className="block border border-line"
            />
            <svg
              className="pointer-events-none absolute inset-0"
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
            >
              <line x1={CANVAS_SIZE / 2} y1={0} x2={CANVAS_SIZE / 2} y2={CANVAS_SIZE} stroke="rgba(0,0,0,0.15)" strokeDasharray="2 3" />
              <line x1={0} y1={CANVAS_SIZE / 2} x2={CANVAS_SIZE} y2={CANVAS_SIZE / 2} stroke="rgba(0,0,0,0.15)" strokeDasharray="2 3" />
              <circle cx={pxX1} cy={pxX2} r={6} fill="white" stroke="black" strokeWidth={2} />
            </svg>
          </div>
          <div className="mt-2 flex w-full justify-between font-mono text-[10px] text-muted" style={{ width: CANVAS_SIZE }}>
            <span>-{RANGE}</span>
            <span>+{RANGE}</span>
          </div>
          <p className="mt-3 max-w-[220px] text-center text-[11px] leading-relaxed text-muted">
            Punctul alb = inputul curent. Pixelii întunecați = output mare.
          </p>
        </div>
      </div>
    </div>
  )
}
