import { useParams, Link } from 'react-router-dom'
import LectieLayout from '@/layouts/LectieLayout'
import { getLectie } from '@/lectii/manifest'
import type { Sectiune } from '@/lectii/manifest'
import type { ComponentType } from 'react'

const lectiiModules = import.meta.glob('/src/lectii/**/*.mdx', { eager: true }) as Record<
  string,
  { default: ComponentType }
>

export default function LectiePage() {
  const { sectiune, slug } = useParams<{ sectiune: string; slug: string }>()

  if (!sectiune || !slug || (sectiune !== 'ml' && sectiune !== 'llm' && sectiune !== 'practica')) {
    return <NotFound />
  }

  const lectie = getLectie(sectiune as Sectiune, slug)
  if (!lectie) return <NotFound />

  const path = `/src/lectii/${sectiune}/${slug}.mdx`
  const mod = lectiiModules[path]
  if (!mod) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-medium tracking-tight">Lecția e în curs de scriere</h1>
        <p className="mt-4 text-muted">
          Pagina &laquo;{lectie.titlu}&raquo; există în manifest, dar conținutul ei nu e încă
          publicat. Revino mai târziu.
        </p>
        <Link to="/lectii" className="mt-6 inline-block text-sm underline underline-offset-4">
          ← Înapoi la lecții
        </Link>
      </div>
    )
  }

  const Content = mod.default
  return (
    <LectieLayout lectie={lectie}>
      <Content />
    </LectieLayout>
  )
}

function NotFound() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-medium tracking-tight">Lecția nu există</h1>
      <p className="mt-4 text-muted">URL-ul nu corespunde cu nicio lecție din curs.</p>
      <Link to="/lectii" className="mt-6 inline-block text-sm underline underline-offset-4">
        ← Înapoi la lecții
      </Link>
    </div>
  )
}
