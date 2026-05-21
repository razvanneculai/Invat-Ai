import { useState } from 'react'

interface Propozitie {
  cheie: string
  tokeni: string[]
  attention: number[][]
  comentariu: string
}

const PROPOZITII: Propozitie[] = [
  {
    cheie: 'pisica',
    tokeni: ['Pisica', 'neagră', 'a', 'sărit', 'gardul'],
    attention: [
      [1.00, 0.55, 0.20, 0.65, 0.35],
      [0.60, 1.00, 0.18, 0.40, 0.22],
      [0.40, 0.20, 1.00, 0.80, 0.30],
      [0.85, 0.30, 0.65, 1.00, 0.70],
      [0.45, 0.15, 0.25, 0.75, 1.00],
    ],
    comentariu:
      'Verbul „sărit" atrage atenția spre subiectul „Pisica" și spre obiectul „gardul" — adică spre cine a sărit și ce. Adjectivul „neagră" se uită mai ales la „Pisica" (cuvântul pe care îl modifică).',
  },
  {
    cheie: 'el',
    tokeni: ['Maria', 'i-a', 'dat', 'lui', 'Andrei', 'o', 'carte', '. El', 'a', 'mulțumit'],
    attention: [
      [1.00, 0.35, 0.25, 0.10, 0.20, 0.05, 0.15, 0.20, 0.10, 0.15],
      [0.55, 1.00, 0.65, 0.25, 0.30, 0.10, 0.20, 0.15, 0.20, 0.18],
      [0.50, 0.70, 1.00, 0.40, 0.55, 0.15, 0.60, 0.20, 0.30, 0.30],
      [0.20, 0.30, 0.50, 1.00, 0.85, 0.10, 0.15, 0.30, 0.20, 0.18],
      [0.30, 0.30, 0.55, 0.80, 1.00, 0.10, 0.20, 0.45, 0.15, 0.25],
      [0.10, 0.15, 0.25, 0.10, 0.15, 1.00, 0.75, 0.10, 0.10, 0.15],
      [0.20, 0.25, 0.50, 0.20, 0.30, 0.65, 1.00, 0.20, 0.20, 0.30],
      [0.25, 0.20, 0.30, 0.25, 0.80, 0.15, 0.30, 1.00, 0.55, 0.65],
      [0.20, 0.30, 0.45, 0.20, 0.40, 0.15, 0.30, 0.55, 1.00, 0.85],
      [0.20, 0.25, 0.40, 0.25, 0.60, 0.15, 0.45, 0.55, 0.80, 1.00],
    ],
    comentariu:
      'Pronumele „El" trebuie să indice cine a mulțumit — Maria sau Andrei? Atenția trasează cu greutatea cea mai mare către „Andrei", soluționând coreferința. Asta e un calcul greu pentru un model: să decidă la cine se referă un pronume.',
  },
  {
    cheie: 'paris',
    tokeni: ['Capitala', 'Franței', 'este', 'orașul', 'Paris'],
    attention: [
      [1.00, 0.85, 0.30, 0.40, 0.50],
      [0.85, 1.00, 0.35, 0.45, 0.75],
      [0.40, 0.45, 1.00, 0.55, 0.65],
      [0.45, 0.40, 0.50, 1.00, 0.80],
      [0.55, 0.80, 0.50, 0.75, 1.00],
    ],
    comentariu:
      'Pentru un fapt geografic, atenția conectează ferm „Franței" și „Paris" — modelul a învățat din date că aceste cuvinte apar des împreună. Asta nu e „cunoaștere", e statistică, dar pentru fapte uzuale ajunge.',
  },
]

export default function AttentionViz() {
  const [prop, setProp] = useState<Propozitie>(PROPOZITII[0])
  const [selected, setSelected] = useState(0)

  const row = prop.attention[selected] ?? []
  const maxAttn = Math.max(...row.filter((_, i) => i !== selected))

  return (
    <div className="not-prose my-10 border border-line bg-paper">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-5 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          Schemă interactivă · attention scores
        </p>
        <select
          value={prop.cheie}
          onChange={e => {
            const p = PROPOZITII.find(x => x.cheie === e.target.value)!
            setProp(p)
            setSelected(0)
          }}
          className="border border-line bg-paper px-2 py-1 font-mono text-xs"
          aria-label="Propoziție"
        >
          {PROPOZITII.map(p => (
            <option key={p.cheie} value={p.cheie}>
              {p.tokeni.join(' ')}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-paper p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
          Click pe un token ca să vezi la ce „se uită"
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {prop.tokeni.map((tok, i) => {
            const isSelected = i === selected
            const attention = i === selected ? 0 : row[i] / Math.max(maxAttn, 0.001)
            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelected(i)}
                className={
                  isSelected
                    ? 'relative border border-ink bg-ink px-3 py-2 font-mono text-xs text-paper'
                    : 'relative border border-line bg-paper px-3 py-2 font-mono text-xs transition-colors hover:border-ink'
                }
                style={
                  !isSelected
                    ? { background: `rgba(0,0,0,${(attention * 0.55).toFixed(3)})` }
                    : undefined
                }
              >
                <span style={!isSelected && attention > 0.5 ? { color: 'white' } : undefined}>
                  {tok}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mt-6 border-t border-line pt-5">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">
            Greutățile de atenție de la „{prop.tokeni[selected]}" către celelalte
          </p>
          <div className="mt-3 space-y-1.5">
            {prop.tokeni.map((tok, i) => {
              if (i === selected) return null
              const a = row[i]
              return (
                <div key={i} className="grid grid-cols-[110px_1fr_50px] items-center gap-3">
                  <span className="truncate font-mono text-xs">{tok}</span>
                  <div className="h-3 bg-soft">
                    <div className="h-full bg-ink" style={{ width: `${a * 100}%` }} />
                  </div>
                  <span className="text-right font-mono text-xs tabular-nums text-muted">
                    {(a * 100).toFixed(0)}%
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">
          {prop.comentariu}
        </p>
        <p className="mt-3 text-[11px] leading-relaxed text-muted">
          Notă: scorurile de atenție de aici sunt alese manual pentru ilustrare. Într-un
          Transformer real, ele se calculează din vectorii (Q, K) ai fiecărui token prin
          formula <span className="font-mono">softmax(Q·Kᵀ / √d)</span>.
        </p>
      </div>
    </div>
  )
}
