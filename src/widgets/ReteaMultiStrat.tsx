import { useEffect, useRef, useState } from 'react'
import Slider from '@/components/Slider'
import {
  forwardMLP,
  PRESET_XOR,
  PRESET_ZERO,
  randomMLP,
} from '@/widgets/_math/multilayer'
import type { MLPParams } from '@/widgets/_math/multilayer'

const CANVAS_SIZE = 220
const RANGE = 2.5

const SLIDER_RANGE = 8
const SLIDER_STEP = 0.1

const TESTS: Array<{ x1: number; x2: number; target: 0 | 1 }> = [
  { x1: 1.5, x2: 1.5, target: 1 },
  { x1: -1.5, x2: -1.5, target: 1 },
  { x1: 1.5, x2: -1.5, target: 0 },
  { x1: -1.5, x2: 1.5, target: 0 },
]

export default function ReteaMultiStrat() {
  const [p, setP] = useState<MLPParams>(PRESET_XOR)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  function setKey<K extends keyof MLPParams>(key: K, value: number) {
    setP(prev => ({ ...prev, [key]: value }))
  }

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
        const { y } = forwardMLP(xi1, xi2, p)
        const gray = Math.round((1 - y) * 255)
        const idx = (py * W + px) * 4
        img.data[idx] = gray
        img.data[idx + 1] = gray
        img.data[idx + 2] = gray
        img.data[idx + 3] = 255
      }
    }
    ctx.putImageData(img, 0, 0)
  }, [p])

  const correct = TESTS.filter(t => {
    const { y } = forwardMLP(t.x1, t.x2, p)
    return (y > 0.5 ? 1 : 0) === t.target
  }).length

  return (
    <div className="not-prose my-10 border border-line bg-paper">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          Schemă interactivă · rețea 2-2-1
        </p>
        <div className="flex gap-2">
          <PresetButton onClick={() => setP(PRESET_XOR)} label="Soluția XOR" />
          <PresetButton onClick={() => setP(randomMLP())} label="Aleator" />
          <PresetButton onClick={() => setP(PRESET_ZERO)} label="Zero" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1fr_auto]">
        <div className="space-y-5 bg-paper p-5">
          <ParamGroup titlu="Layer ascuns · neuron 1 (h₁)">
            <Slider symbol="w₁₁" label="x₁ → h₁" value={p.w11} min={-SLIDER_RANGE} max={SLIDER_RANGE} step={SLIDER_STEP} onChange={v => setKey('w11', v)} />
            <Slider symbol="w₁₂" label="x₂ → h₁" value={p.w12} min={-SLIDER_RANGE} max={SLIDER_RANGE} step={SLIDER_STEP} onChange={v => setKey('w12', v)} />
            <Slider symbol="b₁" label="Bias" value={p.b1} min={-SLIDER_RANGE} max={SLIDER_RANGE} step={SLIDER_STEP} onChange={v => setKey('b1', v)} />
          </ParamGroup>

          <ParamGroup titlu="Layer ascuns · neuron 2 (h₂)">
            <Slider symbol="w₂₁" label="x₁ → h₂" value={p.w21} min={-SLIDER_RANGE} max={SLIDER_RANGE} step={SLIDER_STEP} onChange={v => setKey('w21', v)} />
            <Slider symbol="w₂₂" label="x₂ → h₂" value={p.w22} min={-SLIDER_RANGE} max={SLIDER_RANGE} step={SLIDER_STEP} onChange={v => setKey('w22', v)} />
            <Slider symbol="b₂" label="Bias" value={p.b2} min={-SLIDER_RANGE} max={SLIDER_RANGE} step={SLIDER_STEP} onChange={v => setKey('b2', v)} />
          </ParamGroup>

          <ParamGroup titlu="Output (y)">
            <Slider symbol="v₁" label="h₁ → y" value={p.v1} min={-SLIDER_RANGE} max={SLIDER_RANGE} step={SLIDER_STEP} onChange={v => setKey('v1', v)} />
            <Slider symbol="v₂" label="h₂ → y" value={p.v2} min={-SLIDER_RANGE} max={SLIDER_RANGE} step={SLIDER_STEP} onChange={v => setKey('v2', v)} />
            <Slider symbol="c" label="Bias output" value={p.c} min={-SLIDER_RANGE} max={SLIDER_RANGE} step={SLIDER_STEP} onChange={v => setKey('c', v)} />
          </ParamGroup>
        </div>

        <div className="flex flex-col items-center bg-paper p-5">
          <p className="mb-3 text-[11px] uppercase tracking-[0.2em] text-muted">
            Funcția de decizie pe (x₁, x₂)
          </p>
          <canvas
            ref={canvasRef}
            width={CANVAS_SIZE}
            height={CANVAS_SIZE}
            className="block border border-line"
          />
          <div
            className="mt-2 flex justify-between font-mono text-[10px] text-muted"
            style={{ width: CANVAS_SIZE }}
          >
            <span>-{RANGE}</span>
            <span>+{RANGE}</span>
          </div>
          <div className="mt-4 w-full max-w-[220px] border-t border-line pt-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Test XOR (4 colțuri)</p>
            <p className="mt-2 font-mono text-xl tabular-nums">
              <span className="text-ink">{correct}</span>
              <span className="text-muted">/4</span>{' '}
              <span className="ml-1 text-xs font-sans text-muted">corect</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PresetButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-line px-3 py-1.5 text-[11px] uppercase tracking-wide transition-colors hover:border-ink"
    >
      {label}
    </button>
  )
}

function ParamGroup({ titlu, children }: { titlu: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-muted">{titlu}</p>
      <div className="space-y-2">{children}</div>
    </div>
  )
}
