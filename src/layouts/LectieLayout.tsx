import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { lectii, getNeighbours } from '@/lectii/manifest'
import type { Lectie } from '@/lectii/manifest'
import { isCompleted, markCompleted, unmarkCompleted, getAll } from '@/lib/progress'
import Chip from '@/components/Chip'
import type { ReactNode } from 'react'

interface Props {
  lectie: Lectie
  children: ReactNode
}

export default function LectieLayout({ lectie, children }: Props) {
  const [done, setDone] = useState(false)
  const [progressMap, setProgressMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setDone(isCompleted(lectie.slug))
    const all = getAll()
    const map: Record<string, boolean> = {}
    for (const k of Object.keys(all)) {
      map[k] = !!all[k]?.completed
    }
    setProgressMap(map)
  }, [lectie.slug])

  function toggleDone() {
    if (done) {
      unmarkCompleted(lectie.slug)
      setProgressMap(p => ({ ...p, [lectie.slug]: false }))
      setDone(false)
    } else {
      markCompleted(lectie.slug)
      setProgressMap(p => ({ ...p, [lectie.slug]: true }))
      setDone(true)
    }
  }

  const { prev, next } = getNeighbours(lectie.sectiune, lectie.slug)
  const mlLectii = lectii.filter(l => l.sectiune === 'ml').sort((a, b) => a.ordine - b.ordine)
  const llmLectii = lectii.filter(l => l.sectiune === 'llm').sort((a, b) => a.ordine - b.ordine)
  const practicaLectii = lectii.filter(l => l.sectiune === 'practica').sort((a, b) => a.ordine - b.ordine)

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <details className="lg:hidden">
          <summary className="cursor-pointer border-y border-line py-3 text-sm font-medium">
            Toate lecțiile ({lectii.length})
          </summary>
          <SidebarBody
            mlLectii={mlLectii}
            llmLectii={llmLectii}
            practicaLectii={practicaLectii}
            currentSlug={lectie.slug}
            progressMap={progressMap}
          />
        </details>
        <div className="hidden lg:block">
          <SidebarBody
            mlLectii={mlLectii}
            llmLectii={llmLectii}
            practicaLectii={practicaLectii}
            currentSlug={lectie.slug}
            progressMap={progressMap}
          />
        </div>
      </aside>

      <article>
        <header>
          <Link
            to="/lectii"
            className="text-[11px] uppercase tracking-[0.22em] text-muted transition-colors hover:text-ink"
          >
            ← Toate lecțiile
          </Link>
          <h1 className="mt-4 text-3xl font-medium tracking-tight md:text-4xl">{lectie.titlu}</h1>
          <p className="mt-3 text-muted">{lectie.descriereScurta}</p>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Chip>Clasa {lectie.clasa}</Chip>
            <Chip>~{lectie.durataMin} min</Chip>
            {lectie.preRequisites.map(p => (
              <Chip key={p}>↳ {p}</Chip>
            ))}
          </div>
        </header>

        <div className="prose mt-12 max-w-none text-ink prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-ink prose-p:leading-relaxed prose-p:text-ink prose-strong:text-ink prose-a:text-ink prose-a:underline-offset-4 prose-li:text-ink prose-code:bg-soft prose-code:px-1.5 prose-code:py-0.5 prose-code:font-mono prose-code:text-[0.9em] prose-code:font-normal prose-code:text-ink prose-code:before:content-none prose-code:after:content-none prose-pre:border prose-pre:border-line prose-pre:bg-soft prose-pre:text-ink prose-pre:shadow-none">
          {children}
        </div>

        <div className="mt-16 border-t border-line pt-8">
          <button
            type="button"
            onClick={toggleDone}
            className={
              done
                ? 'inline-flex items-center gap-2 border border-ink bg-ink px-5 py-2.5 text-sm font-medium text-paper'
                : 'inline-flex items-center gap-2 border border-line px-5 py-2.5 text-sm transition-colors hover:border-ink'
            }
          >
            {done ? '✓ Lecție citită' : 'Marchează ca citită'}
          </button>
        </div>

        <nav className="mt-12 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
          {prev ? (
            <Link
              to={`/lectii/${prev.sectiune}/${prev.slug}`}
              className="bg-paper p-5 transition-colors hover:bg-soft"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">← Anterior</p>
              <p className="mt-2 font-medium tracking-tight">{prev.titlu}</p>
            </Link>
          ) : (
            <div className="bg-paper p-5">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Anterior</p>
              <p className="mt-2 text-sm text-muted">Aceasta e prima lecție.</p>
            </div>
          )}
          {next ? (
            <Link
              to={`/lectii/${next.sectiune}/${next.slug}`}
              className="bg-paper p-5 text-right transition-colors hover:bg-soft"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Următor →</p>
              <p className="mt-2 font-medium tracking-tight">{next.titlu}</p>
            </Link>
          ) : (
            <div className="bg-paper p-5 text-right">
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted">Următor</p>
              <p className="mt-2 text-sm text-muted">Aceasta e ultima lecție.</p>
            </div>
          )}
        </nav>
      </article>
    </div>
  )
}

function SidebarBody({
  mlLectii,
  llmLectii,
  practicaLectii,
  currentSlug,
  progressMap,
}: {
  mlLectii: Lectie[]
  llmLectii: Lectie[]
  practicaLectii: Lectie[]
  currentSlug: string
  progressMap: Record<string, boolean>
}) {
  return (
    <div className="py-2 text-sm">
      <SidebarGroup titlu="Machine Learning" items={mlLectii} currentSlug={currentSlug} progressMap={progressMap} />
      <SidebarGroup titlu="LLM" items={llmLectii} currentSlug={currentSlug} progressMap={progressMap} />
      <SidebarGroup titlu="Practică" items={practicaLectii} currentSlug={currentSlug} progressMap={progressMap} />
    </div>
  )
}

function SidebarGroup({
  titlu,
  items,
  currentSlug,
  progressMap,
}: {
  titlu: string
  items: Lectie[]
  currentSlug: string
  progressMap: Record<string, boolean>
}) {
  return (
    <div className="mb-6">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-muted">{titlu}</p>
      <ul className="space-y-0.5">
        {items.map(l => {
          const isCurrent = l.slug === currentSlug
          const isDone = progressMap[l.slug]
          return (
            <li key={l.slug}>
              <NavLink
                to={`/lectii/${l.sectiune}/${l.slug}`}
                className={
                  isCurrent
                    ? 'flex items-baseline gap-2 border-l-2 border-ink py-1.5 pl-3 text-ink'
                    : 'flex items-baseline gap-2 border-l-2 border-transparent py-1.5 pl-3 text-muted transition-colors hover:text-ink'
                }
              >
                <span className="font-mono text-[10px] tabular-nums">
                  {isDone ? '✓' : String(l.ordine).padStart(2, '0')}
                </span>
                <span className="leading-tight">{l.titlu}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
