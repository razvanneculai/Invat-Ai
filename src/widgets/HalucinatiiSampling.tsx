import { useState } from 'react'

interface Scenariu {
  cheie: string
  prompt: string
  optiuni: { token: string; prob: number; corect: boolean }[]
  explicatie: string
}

const SCENARII: Scenariu[] = [
  {
    cheie: 'capitala',
    prompt: 'Capitala României este',
    optiuni: [
      { token: ' București', prob: 0.78, corect: true },
      { token: ' Cluj', prob: 0.07, corect: false },
      { token: ' Brașov', prob: 0.05, corect: false },
      { token: ' Sibiu', prob: 0.03, corect: false },
      { token: ' situată', prob: 0.04, corect: false },
      { token: ' un', prob: 0.03, corect: false },
    ],
    explicatie:
      'Pentru fapte uzuale, modelul e foarte sigur. București primește ~78%. Dar restul 22% e tot „undeva în distribuție" — în 1 din 5 cazuri, modelul poate alege un alt răspuns.',
  },
  {
    cheie: 'satelit',
    prompt: 'Satelitul Calypso, descoperit de NASA în 2024, are diametrul de',
    optiuni: [
      { token: ' aproximativ', prob: 0.22, corect: false },
      { token: ' circa', prob: 0.18, corect: false },
      { token: ' 12', prob: 0.15, corect: false },
      { token: ' 24', prob: 0.13, corect: false },
      { token: ' 8', prob: 0.12, corect: false },
      { token: ' 50', prob: 0.10, corect: false },
      { token: ' câțiva', prob: 0.10, corect: false },
    ],
    explicatie:
      'Satelitul „Calypso" descoperit în 2024 nu există — l-am inventat. Dar modelul nu „știe că nu știe". Va completa cu un răspuns plauzibil-arătând și complet inventat. Asta e o halucinație.',
  },
  {
    cheie: 'doi-plus-doi',
    prompt: '2 + 2 =',
    optiuni: [
      { token: ' 4', prob: 0.92, corect: true },
      { token: ' patru', prob: 0.05, corect: true },
      { token: ' 5', prob: 0.01, corect: false },
      { token: ' ?', prob: 0.01, corect: false },
      { token: '4', prob: 0.01, corect: true },
    ],
    explicatie:
      'Pentru operații simple, văzute frecvent în date, modelul e aproape sigur. Dar „aproape sigur" nu e același lucru cu „știe matematică" — pentru calcule rare, performanța scade brusc.',
  },
]

function sample(opts: Scenariu['optiuni']): Scenariu['optiuni'][number] {
  const r = Math.random()
  let acc = 0
  for (const o of opts) {
    acc += o.prob
    if (r <= acc) return o
  }
  return opts[opts.length - 1]
}

export default function HalucinatiiSampling() {
  const [scen, setScen] = useState<Scenariu>(SCENARII[0])
  const [chosen, setChosen] = useState<Scenariu['optiuni'][number] | null>(null)

  return (
    <div className="not-prose my-10 border border-line bg-paper">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line px-5 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          Schemă interactivă · distribuția next-token
        </p>
        <select
          value={scen.cheie}
          onChange={e => {
            const s = SCENARII.find(x => x.cheie === e.target.value)!
            setScen(s)
            setChosen(null)
          }}
          className="border border-line bg-paper px-2 py-1 font-mono text-xs"
          aria-label="Scenariu"
        >
          {SCENARII.map(s => (
            <option key={s.cheie} value={s.cheie}>
              {s.prompt}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-paper p-5">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Prompt</p>
        <p className="mt-2 font-mono text-sm">
          „{scen.prompt}
          {chosen && <span className="bg-ink px-1 text-paper">{chosen.token}</span>}
          …"
        </p>

        <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-muted">
          Probabilitățile prezise pentru următorul token
        </p>
        <div className="mt-3 space-y-1.5">
          {scen.optiuni
            .slice()
            .sort((a, b) => b.prob - a.prob)
            .map(o => (
              <div key={o.token} className="grid grid-cols-[110px_1fr_50px] items-center gap-3">
                <span className="font-mono text-xs">
                  {o.token}
                  {o.corect && <span className="ml-1 text-[10px] text-muted">(corect)</span>}
                </span>
                <div className="h-3 bg-soft">
                  <div className="h-full bg-ink" style={{ width: `${o.prob * 100}%` }} />
                </div>
                <span className="text-right font-mono text-xs tabular-nums text-muted">
                  {(o.prob * 100).toFixed(0)}%
                </span>
              </div>
            ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setChosen(sample(scen.optiuni))}
            className="border border-ink bg-ink px-4 py-2 text-xs font-medium text-paper transition-colors hover:bg-ink/85"
          >
            Sample un token →
          </button>
          <button
            type="button"
            onClick={() => setChosen(null)}
            className="border border-line px-4 py-2 text-xs transition-colors hover:border-ink"
          >
            Reset
          </button>
        </div>

        <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">
          {scen.explicatie}
        </p>
      </div>
    </div>
  )
}
