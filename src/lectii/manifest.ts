export type ClasaRomana = 'IX' | 'X' | 'XI' | 'XII'
export type Sectiune = 'ml' | 'llm' | 'practica'

export interface Lectie {
  slug: string
  sectiune: Sectiune
  titlu: string
  descriereScurta: string
  clasa: ClasaRomana
  preRequisites: string[]
  durataMin: number
  ordine: number
}

export const SECTIUNI: Record<Sectiune, { titlu: string; descriereScurta: string }> = {
  ml: { titlu: 'Machine Learning', descriereScurta: 'De la un neuron la rețele care învață singure.' },
  llm: { titlu: 'Modele de limbaj (LLM)', descriereScurta: 'Cum „înțeleg" și generează text modelele mari.' },
  practica: { titlu: 'AI în practică', descriereScurta: 'Cum folosești bine AI-ul și unde sunt limitele lui.' },
}

const SECTIUNE_ORDINE: Record<Sectiune, number> = { ml: 0, llm: 1, practica: 2 }

export const lectii: Lectie[] = [
  {
    slug: 'neuron',
    sectiune: 'ml',
    titlu: 'Neuronul artificial',
    descriereScurta: 'Ce face un singur neuron — și de ce.',
    clasa: 'IX',
    preRequisites: ['Funcții', 'Operații cu numere reale'],
    durataMin: 10,
    ordine: 1,
  },
  {
    slug: 'perceptron',
    sectiune: 'ml',
    titlu: 'Perceptronul',
    descriereScurta: 'Cum „învață" un neuron să clasifice puncte.',
    clasa: 'IX',
    preRequisites: ['Neuronul artificial'],
    durataMin: 12,
    ordine: 2,
  },
  {
    slug: 'activare',
    sectiune: 'ml',
    titlu: 'Funcții de activare',
    descriereScurta: 'Sigmoid, ReLU, tanh — de ce e nevoie de non-linearitate.',
    clasa: 'X',
    preRequisites: ['Neuronul artificial', 'Funcții elementare'],
    durataMin: 10,
    ordine: 3,
  },
  {
    slug: 'retea-multi-strat',
    sectiune: 'ml',
    titlu: 'Rețele multi-strat',
    descriereScurta: 'Mai mulți neuroni împreună rezolvă probleme imposibile pentru unul singur.',
    clasa: 'X',
    preRequisites: ['Funcții de activare'],
    durataMin: 15,
    ordine: 4,
  },
  {
    slug: 'antrenare-intuitie',
    sectiune: 'ml',
    titlu: 'Cum „învață" o rețea',
    descriereScurta: 'Intuiția din spatele coborârii pe gradient.',
    clasa: 'XI',
    preRequisites: ['Derivate', 'Rețele multi-strat'],
    durataMin: 15,
    ordine: 5,
  },
  {
    slug: 'overfitting',
    sectiune: 'ml',
    titlu: 'Overfitting și generalizare',
    descriereScurta: 'Cum recunoști dacă modelul a învățat sau doar a memorat datele.',
    clasa: 'XI',
    preRequisites: ['Cum „învață" o rețea'],
    durataMin: 12,
    ordine: 6,
  },
  {
    slug: 'tokeni',
    sectiune: 'llm',
    titlu: 'Tokeni',
    descriereScurta: 'Cum sparge un LLM textul în bucăți.',
    clasa: 'IX',
    preRequisites: [],
    durataMin: 8,
    ordine: 1,
  },
  {
    slug: 'embeddings',
    sectiune: 'llm',
    titlu: 'Embedding-uri',
    descriereScurta: 'Cuvinte transformate în vectori; vectori apropiați = sens apropiat.',
    clasa: 'X',
    preRequisites: ['Vectori în plan'],
    durataMin: 12,
    ordine: 2,
  },
  {
    slug: 'atentie',
    sectiune: 'llm',
    titlu: 'Atenție și Transformer',
    descriereScurta: 'Mecanismul prin care un LLM „se uită" la cuvintele relevante din context.',
    clasa: 'XI',
    preRequisites: ['Embedding-uri'],
    durataMin: 15,
    ordine: 3,
  },
  {
    slug: 'halucinatii',
    sectiune: 'llm',
    titlu: 'De ce halucinează LLM-urile',
    descriereScurta: 'Probabilitate next-token și de ce un LLM nu „știe" nimic.',
    clasa: 'XI',
    preRequisites: ['Tokeni', 'Atenție și Transformer'],
    durataMin: 12,
    ordine: 4,
  },
  {
    slug: 'prompt-engineering',
    sectiune: 'practica',
    titlu: 'Prompt engineering',
    descriereScurta: 'Cum formulezi cereri către un LLM ca să obții răspunsuri bune.',
    clasa: 'IX',
    preRequisites: [],
    durataMin: 12,
    ordine: 1,
  },
  {
    slug: 'etica',
    sectiune: 'practica',
    titlu: 'Etică și limite',
    descriereScurta: 'Când nu ar trebui să te bazezi pe un AI — și de ce.',
    clasa: 'X',
    preRequisites: ['Prompt engineering'],
    durataMin: 12,
    ordine: 2,
  },
]

export function getLectie(sectiune: Sectiune, slug: string): Lectie | undefined {
  return lectii.find(l => l.sectiune === sectiune && l.slug === slug)
}

export function getNeighbours(sectiune: Sectiune, slug: string): {
  prev: Lectie | undefined
  next: Lectie | undefined
} {
  const all = [...lectii].sort((a, b) => {
    if (a.sectiune !== b.sectiune) {
      return SECTIUNE_ORDINE[a.sectiune] - SECTIUNE_ORDINE[b.sectiune]
    }
    return a.ordine - b.ordine
  })
  const idx = all.findIndex(l => l.sectiune === sectiune && l.slug === slug)
  return {
    prev: idx > 0 ? all[idx - 1] : undefined,
    next: idx >= 0 && idx < all.length - 1 ? all[idx + 1] : undefined,
  }
}
