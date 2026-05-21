const KEY = 'infoed-ai:progress-v1'

interface Entry {
  completed: boolean
  completedAt?: number
}

type Progress = Record<string, Entry>

function read(): Progress {
  if (typeof localStorage === 'undefined') return {}
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Progress) : {}
  } catch {
    return {}
  }
}

function write(p: Progress): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* localStorage full or blocked — silent */
  }
}

export function isCompleted(slug: string): boolean {
  return read()[slug]?.completed === true
}

export function markCompleted(slug: string): void {
  const p = read()
  p[slug] = { completed: true, completedAt: Date.now() }
  write(p)
}

export function unmarkCompleted(slug: string): void {
  const p = read()
  delete p[slug]
  write(p)
}

export function getAll(): Progress {
  return read()
}

export function clearAll(): void {
  write({})
}
