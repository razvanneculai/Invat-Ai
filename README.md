# Învăț AI — site educațional despre AI și machine learning

Proiect personal pentru **Olimpiada de Inovare și Creație Digitală — InfoEducație 2026**, secțiunea **Software Educațional**.

Site interactiv în limba română care explică elevilor de liceu cum funcționează rețelele neuronale și modele de limbaj (LLM), prin scheme cu sliders pe care utilizatorul le poate modifica în timp real.

## Conținut

- **6 lecții Machine Learning**: neuronul artificial, perceptronul, funcții de activare, rețele multi-strat, coborârea pe gradient, overfitting & generalizare.
- **4 lecții LLM**: tokeni, embedding-uri, atenție și Transformer, halucinații.
- **2 lecții AI în practică**: prompt engineering, etică și limite.
- **10 widget-uri interactive** care însoțesc lecțiile.
- Tot conținutul în **limba română**, etichetat pe clase IX–XII.

## Rulare locală

Necesită Node.js 20+ și npm.

```bash
npm install
npm run dev
```

Apoi deschide [http://localhost:5173](http://localhost:5173).

Pentru build de producție:

```bash
npm run build
```

Output în `dist/`.

## Stack tehnologic

- React 19 + TypeScript
- Vite 8 (build tool)
- Tailwind CSS v4 (styling)
- React Router 7 (routing)
- Framer Motion (animații)
- MDX (lecții cu widgets integrate)

## Structură

```
src/
  layouts/        — SiteLayout, LectieLayout
  pages/          — Acasa, IndexLectii, Lectie
  lectii/
    manifest.ts   — metadate lecții (slug, clasă, ordine, prerequisites)
    ml/*.mdx      — 6 lecții Machine Learning
    llm/*.mdx     — 4 lecții LLM
    practica/*.mdx — 2 lecții AI în practică
  widgets/
    _math/        — funcții matematice pure (activation, neuron, multilayer, polyfit, datasets, embeddings)
    *.tsx         — 10 widgets interactive
  components/     — Slider, Chip (custom, fără shadcn)
  lib/
    progress.ts   — wrapper localStorage pentru progres
```

---

## Componente neoriginale (conform Art. 9.1 — Regulament InfoEducație)

Acest proiect a fost construit în jurul următoarelor componente externe, niciuna dintre ele realizată de autor:

### Librării software (NPM)

| Librărie | Versiune | Licență | Sursă |
|---|---|---|---|
| react | ^19.2 | MIT | https://react.dev |
| react-dom | ^19.2 | MIT | https://react.dev |
| react-router-dom | ^7.15 | MIT | https://reactrouter.com |
| framer-motion | ^12.38 | MIT | https://www.framer.com/motion |
| vite | ^8.0 | MIT | https://vite.dev |
| @vitejs/plugin-react | ^6.0 | MIT | https://github.com/vitejs/vite-plugin-react |
| tailwindcss | ^4.3 | MIT | https://tailwindcss.com |
| @tailwindcss/vite | ^4.3 | MIT | https://tailwindcss.com |
| @tailwindcss/typography | ^0.5 | MIT | https://github.com/tailwindlabs/tailwindcss-typography |
| @mdx-js/rollup | ^3.1 | MIT | https://mdxjs.com |
| typescript | ^6.0 | Apache 2.0 | https://www.typescriptlang.org |
| eslint + typescript-eslint | ^10 / ^8 | MIT / BSD-2 | https://eslint.org |

Lista completă cu toate sub-dependențele se regăsește în `package-lock.json`.

### Fonturi

| Font | Licență | Sursă |
|---|---|---|
| Inter | OFL 1.1 | https://rsms.me/inter — încărcat via Google Fonts |
| JetBrains Mono | OFL 1.1 | https://www.jetbrains.com/lp/mono — încărcat via Google Fonts |

### Date

- **Embedding-urile** din widget-ul `EmbeddingPlanar` (lecția „Embedding-uri") nu sunt produse de un model real. Sunt **poziții 2D alese manual de autor** pentru 38 de cuvinte românești grupate pe 6 categorii tematice, cu mici perturbări aleatorii pentru aspect natural. Acest fapt e menționat explicit în textul lecției — datele sunt **pedagogice, nu autentice**. Sursa: `src/widgets/_math/embeddings-data.ts`.
- **Probabilitățile** pentru widget-ul `HalucinatiiSampling` sunt **valori plauzibile alese manual de autor** pentru a ilustra distribuția next-token a unui LLM, **nu sunt rezultatul rulării unui model real**. Sursa: `src/widgets/HalucinatiiSampling.tsx`.

### Tokenizator-ul demonstrativ

Widget-ul `TokenSplitter` (lecția „Tokeni") implementează un algoritm **simplificat și original** de tokenizare bazat pe sufixe/prefixe românești frecvente. **Nu** e o reproducere a unui algoritm BPE existent. Sursa: `src/widgets/TokenSplitter.tsx`. Lecția menționează că tokenizatorul real al unui LLM (BPE) e diferit.


Niciun text din lecții nu a fost copiat dintr-o altă sursă. Niciun fragment de cod (cu excepția configurației de bază generate de `npm create vite`) nu a fost preluat din alte proiecte.

---

## Licență

Codul propriu al autorului este disponibil sub licență MIT.
Componentele externe rămân sub licențele lor proprii (vezi tabelul mai sus).

## AI
AI a fost folosit in acest proiect pentru Completarea codului, creearea widget-urilor, completare text si documentatie README, implicit pentru fisierul DOCUMENTATIE_TEHNICA.md.

