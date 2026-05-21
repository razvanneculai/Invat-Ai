import { Link } from 'react-router-dom'
import { lectii } from '@/lectii/manifest'

const ml = lectii.filter(l => l.sectiune === 'ml').sort((a, b) => a.ordine - b.ordine)
const llm = lectii.filter(l => l.sectiune === 'llm').sort((a, b) => a.ordine - b.ordine)
const practica = lectii.filter(l => l.sectiune === 'practica').sort((a, b) => a.ordine - b.ordine)

export default function IndexLectii() {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Toate lecțiile</p>
      <h1 className="mt-3 text-3xl font-medium tracking-tight md:text-4xl">Lecții</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Cele {lectii.length} lecții sunt grupate pe trei secțiuni. Recomandăm să le parcurgi
        în ordinea numerotată, dar fiecare lecție are propriile prerequisites,
        așa că poți sări dacă deja cunoști subiectul.
      </p>

      <div className="mt-16 space-y-16">
        <Section titlu="Machine Learning" descriere={`${ml.length} lecții despre cum funcționează rețelele neuronale.`} lectii={ml} />
        <Section titlu="Modele de limbaj (LLM)" descriere={`${llm.length} lecții despre cum „înțeleg” textul modelele mari.`} lectii={llm} />
        <Section titlu="AI în practică" descriere={`${practica.length} lecții despre cum folosești bine AI-ul și unde sunt limitele lui.`} lectii={practica} />
      </div>
    </div>
  )
}

function Section({
  titlu,
  descriere,
  lectii: items,
}: {
  titlu: string
  descriere: string
  lectii: typeof lectii
}) {
  return (
    <section>
      <div className="flex items-baseline justify-between border-b border-line pb-3">
        <h2 className="text-xl font-medium tracking-tight">{titlu}</h2>
        <p className="text-xs text-muted">{descriere}</p>
      </div>
      <ul className="divide-y divide-line">
        {items.map(l => (
          <li key={l.slug}>
            <Link
              to={`/lectii/${l.sectiune}/${l.slug}`}
              className="grid grid-cols-[2rem_1fr_auto] items-baseline gap-4 py-5 transition-colors hover:bg-soft"
            >
              <span className="font-mono text-xs text-muted">{String(l.ordine).padStart(2, '0')}</span>
              <div>
                <p className="font-medium tracking-tight">{l.titlu}</p>
                <p className="mt-1 text-sm text-muted">{l.descriereScurta}</p>
              </div>
              <div className="text-right text-xs text-muted">
                <p>Clasa {l.clasa}</p>
                <p className="mt-0.5">~{l.durataMin} min</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
