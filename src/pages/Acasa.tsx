import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { lectii } from '@/lectii/manifest'

const ml = lectii.filter(l => l.sectiune === 'ml').sort((a, b) => a.ordine - b.ordine)
const llm = lectii.filter(l => l.sectiune === 'llm').sort((a, b) => a.ordine - b.ordine)
const practica = lectii.filter(l => l.sectiune === 'practica').sort((a, b) => a.ordine - b.ordine)

export default function Acasa() {
  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className="mb-6 text-[11px] uppercase tracking-[0.22em] text-muted">
          Site educațional · {lectii.length} lecții · în limba română
        </p>
        <h1 className="max-w-3xl text-4xl font-medium leading-[1.05] tracking-tight md:text-6xl">
          Învață cum gândește un model AI,
          <br />
          <span className="text-muted">piesă cu piesă.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
          Un curs scurt despre rețele neuronale și modele de limbaj, scris
          pentru elevii de liceu. Muți slidere, vezi cum se schimbă greutățile,
          înțelegi de ce funcționează.
        </p>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link
            to="/lectii/ml/neuron"
            className="inline-flex items-center gap-2 bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-ink/85"
          >
            Începe cu prima lecție
            <span aria-hidden>→</span>
          </Link>
          <Link
            to="/lectii"
            className="inline-flex items-center gap-2 border border-line px-6 py-3 text-sm transition-colors hover:border-ink"
          >
            Vezi toate lecțiile
          </Link>
        </div>
      </motion.section>

      <section className="mt-28 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
        <SectionCard
          eticheta="Secțiunea 1"
          titlu="Machine Learning"
          descriere="De la un singur neuron la rețele multi-strat. Schimbi greutățile, vezi imediat ce se întâmplă."
          lectii={ml}
        />
        <SectionCard
          eticheta="Secțiunea 2"
          titlu="Modele de limbaj (LLM)"
          descriere="Tokeni, embedding-uri, atenție. Înțelege ce face ChatGPT când îți răspunde, și ce nu face."
          lectii={llm}
        />
        <SectionCard
          eticheta="Secțiunea 3"
          titlu="AI în practică"
          descriere="Cum scrii prompturi bune, când să ai încredere în răspuns și care sunt limitele etice."
          lectii={practica}
        />
      </section>

      <section className="mt-28 border-t border-line pt-12">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted">De ce există acest site</p>
        <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2">
          <Pillar
            titlu="Interactiv, nu pasiv"
            text="Fiecare lecție are o schemă pe care o poți modifica. Nu citești despre cum funcționează un neuron, îl reglezi tu."
          />
          <Pillar
            titlu="Pentru programa românească"
            text="Lecțiile sunt etichetate pe clasă (IX-XII) și au prerequisites clare. Știi exact ce trebuie să cunoști înainte."
          />
        </div>
      </section>
    </div>
  )
}

interface CardProps {
  eticheta: string
  titlu: string
  descriere: string
  lectii: typeof lectii
}

function SectionCard({ eticheta, titlu, descriere, lectii: items }: CardProps) {
  return (
    <div className="bg-paper p-8 md:p-10">
      <p className="text-[11px] uppercase tracking-[0.22em] text-muted">{eticheta}</p>
      <h2 className="mt-4 text-2xl font-medium tracking-tight">{titlu}</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted">{descriere}</p>
      <ol className="mt-6 space-y-2.5 text-sm">
        {items.map(l => (
          <li key={l.slug} className="flex items-baseline justify-between gap-4">
            <Link
              to={`/lectii/${l.sectiune}/${l.slug}`}
              className="transition-colors hover:text-muted"
            >
              <span className="text-muted">{l.ordine}.</span> {l.titlu}
            </Link>
            <span className="shrink-0 text-xs text-muted">Clasa {l.clasa}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function Pillar({ titlu, text }: { titlu: string; text: string }) {
  return (
    <div>
      <h3 className="text-base font-medium tracking-tight">{titlu}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
    </div>
  )
}
