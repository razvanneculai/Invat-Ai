export interface CuvantEmb {
  cuvant: string
  x: number
  y: number
  categorie: string
}

const CATEGORII: Record<string, { center: [number, number]; cuvinte: string[] }> = {
  Animale: { center: [-2.6, 1.5], cuvinte: ['pisică', 'câine', 'leu', 'urs', 'cal', 'lup', 'vulpe', 'iepure'] },
  Alimente: { center: [2.6, 1.5], cuvinte: ['pâine', 'lapte', 'cafea', 'vin', 'brânză', 'pește', 'ciocolată'] },
  Emoții: { center: [-2.6, -1.5], cuvinte: ['bucurie', 'tristețe', 'frică', 'iubire', 'mândrie', 'surpriză'] },
  Locuri: { center: [0, 1.8], cuvinte: ['oraș', 'sat', 'casă', 'școală', 'munte', 'lac', 'pădure'] },
  Timp: { center: [2.6, -1.5], cuvinte: ['ieri', 'azi', 'mâine', 'an', 'lună', 'noapte'] },
  Mișcare: { center: [0, -1.7], cuvinte: ['alerga', 'merge', 'sări', 'înota', 'zbura', 'urca'] },
}

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = mulberry32(7)
export const cuvinte: CuvantEmb[] = (() => {
  const out: CuvantEmb[] = []
  for (const [categorie, { center, cuvinte }] of Object.entries(CATEGORII)) {
    for (const c of cuvinte) {
      out.push({
        cuvant: c,
        x: center[0] + (rng() - 0.5) * 1.4,
        y: center[1] + (rng() - 0.5) * 1.2,
        categorie,
      })
    }
  }
  return out
})()
