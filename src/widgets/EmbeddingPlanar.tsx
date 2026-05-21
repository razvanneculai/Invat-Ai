import { useMemo, useState } from 'react'
import { cuvinte } from '@/widgets/_math/embeddings-data'

const W = 420
const H = 320
const RANGE_X = 4
const RANGE_Y = 3

function toPx(x: number, y: number): [number, number] {
  const px = ((x + RANGE_X) / (2 * RANGE_X)) * W
  const py = H - ((y + RANGE_Y) / (2 * RANGE_Y)) * H
  return [px, py]
}

export default function EmbeddingPlanar() {
  const [query, setQuery] = useState('')
  const q = query.toLowerCase().trim()
  const selected = q ? cuvinte.find(c => c.cuvant === q) : undefined

  const neighbors = useMemo(() => {
    if (!selected) return []
    return cuvinte
      .filter(c => c !== selected)
      .map(c => ({ ...c, dist: Math.hypot(c.x - selected.x, c.y - selected.y) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 5)
  }, [selected])

  const nearestSet = new Set(neighbors.map(n => n.cuvant))

  return (
    <div className="not-prose my-10 border border-line bg-paper">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-5 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          Schemă interactivă · embedding-uri (demonstrație)
        </p>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Tastează un cuvânt (ex: pisică)"
          className="border border-line bg-paper px-2 py-1 font-mono text-xs focus:border-ink focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1fr_auto]">
        <div className="bg-paper p-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Top 5 cele mai apropiate</p>
          {selected ? (
            <ul className="mt-3 space-y-1.5 font-mono text-xs">
              {neighbors.map((n, i) => (
                <li key={n.cuvant} className="flex justify-between">
                  <span>
                    <span className="text-muted">{i + 1}.</span> {n.cuvant}
                  </span>
                  <span className="text-muted">{n.categorie}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">
              Tastează un cuvânt din listă ca să vezi vecinii lui în spațiul de embedding.
            </p>
          )}

          <div className="mt-6 border-t border-line pt-4">
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
              Cuvinte disponibile ({cuvinte.length})
            </p>
            <p className="mt-2 font-mono text-[11px] leading-relaxed text-muted">
              {cuvinte.map(c => c.cuvant).join(' · ')}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-paper p-5">
          <svg width={W} height={H} className="border border-line bg-paper">
            {cuvinte.map(c => {
              const [px, py] = toPx(c.x, c.y)
              const isSelected = c === selected
              const isNeighbor = nearestSet.has(c.cuvant)
              const r = isSelected ? 5 : isNeighbor ? 4 : 2.5
              const color = isSelected || isNeighbor ? 'black' : 'rgba(0,0,0,0.5)'
              const fontWeight = isSelected ? 600 : isNeighbor ? 500 : 400
              return (
                <g key={c.cuvant}>
                  <circle
                    cx={px}
                    cy={py}
                    r={r}
                    fill={isSelected || isNeighbor ? 'black' : 'white'}
                    stroke={color}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  <text
                    x={px + 7}
                    y={py + 3.5}
                    fontSize={isSelected ? 11 : 9.5}
                    fontFamily="Inter, sans-serif"
                    fill={color}
                    fontWeight={fontWeight}
                  >
                    {c.cuvant}
                  </text>
                </g>
              )
            })}
          </svg>
          <p className="mt-3 max-w-[420px] text-center text-[11px] leading-relaxed text-muted">
            Cuvintele apropiate ca sens sunt apropiate și ca poziție. Aici pozițiile sunt
            puse de mână în 6 grupuri tematice; într-un model real, ele sunt învățate
            automat din miliarde de propoziții.
          </p>
        </div>
      </div>
    </div>
  )
}
