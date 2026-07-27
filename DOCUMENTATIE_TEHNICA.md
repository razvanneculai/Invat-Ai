# Documentație tehnică

**Proiect:** Învăț AI — site educațional despre AI și machine learning
**Concurs:** Olimpiada de Inovare și Creație Digitală — InfoEducație 2026
**Secțiune:** Software Educațional
**Autor:** Neculai Razvan, Morogan Christian, clasa A XI-a, A IX-a, Colegiul National "Nicolae Balcescu" Braila

---

## 1. Scopul proiectului

Lucrarea își propune să introducă elevii de liceu — în special pe cei de filiera mate-info sau intensiv informatică — în conceptele fundamentale ale inteligenței artificiale și învățării automate. Spre deosebire de articolele de popularizare sau de tutorialele video, abordarea folosită aici este **interactivă**: pentru fiecare concept, utilizatorul interacționează cu o schemă pe care o poate modifica direct, văzând imediat efectul.

**Public-țintă:** elevi clasele IX–XII, fără cunoștințe prealabile de AI sau ML, dar cu bază matematică solidă (funcții, vectori, derivate).

**Ipoteza didactică:** un elev care poate manipula direct greutățile unui neuron și poate observa cum se schimbă outputul va înțelege mai bine ce face un model decât unul care citește un articol descriptiv. Site-ul testează această ipoteză prin 10 widget-uri interactive care însoțesc cele 12 lecții.

## 2. Conținut

### Secțiunea Machine Learning (6 lecții)

1. **Neuronul artificial** (clasa IX) — definiția unui neuron: sumă ponderată + bias + activare. Widget: `NeuronInteractiv`.
2. **Perceptronul** (clasa IX) — învățarea automată; limita perceptronului (XOR). Widget: `PerceptronClasificator` cu două dataseturi.
3. **Funcții de activare** (clasa X) — de ce e nevoie de non-linearitate; sigmoid, ReLU, tanh. Widget: `ActivareSandbox`.
4. **Rețele multi-strat** (clasa X) — rezolvarea XOR cu rețea 2-2-1. Widget: `ReteaMultiStrat`.
5. **Cum „învață" o rețea** (clasa XI) — intuiția coborârii pe gradient. Widget: `GradientDescent1D`.
6. **Overfitting și generalizare** (clasa XI) — bias-variance, regularizare, dropout, early stopping. Widget: `PolinomFit` (regresie polinomială grad 1–12).

### Secțiunea Modele de limbaj (4 lecții)

1. **Tokeni** (clasa IX) — cum sparge un LLM textul în bucăți. Widget: `TokenSplitter`.
2. **Embedding-uri** (clasa X) — reprezentarea cuvintelor ca vectori. Widget: `EmbeddingPlanar`.
3. **Atenție și Transformer** (clasa XI) — mecanismul de atenție, Q/K/V, arhitectura Transformer. Widget: `AttentionViz`.
4. **De ce halucinează LLM-urile** (clasa XI) — sampling, distribuții next-token. Widget: `HalucinatiiSampling`.

### Secțiunea AI în practică (2 lecții)

1. **Prompt engineering** (clasa IX) — 5 tehnici cu exemple comparate înainte/după.
2. **Etică și limite** (clasa X) — bias, halucinații, copyright, confidențialitate, dependență cognitivă, impact societal.

## 3. Decizii de design

### 3.1. Paletă cromatică alb-negru

Site-ul folosește exclusiv alb (`#ffffff`), negru (`#0a0a0a`) și două nuanțe intermediare de gri (`#71717a`, `#e4e4e7`). Această alegere are trei motive:

- **Lizibilitate maximă** pentru conținut text dens (lecții lungi cu formule).
- **Atragerea atenției pe interactivitate**: când singurul element colorat dintr-o pagină ar fi o schemă, schema devine focusul.
- **Stil reținut, profesional** — site-uri educaționale comerciale folosesc adesea culori vii care obosesc la lectură prelungită.

### 3.2. Stack tehnologic

| Aspect | Alegere | Motivație |
|---|---|---|
| Build tool | Vite | Cel mai rapid dev server actual; HMR sub 200ms. |
| Framework | React 19 + TypeScript | Standard industrial, TS pentru siguranță de tipuri în widget-uri. |
| Styling | Tailwind CSS v4 | Stilizare rapidă, consistență automată, build CSS mic (6 KB gzip). |
| Rutare | React Router 7 | Pentru rute `/lectii/:sectiune/:slug`. |
| Conținut | MDX | Permite intercalarea de widget-uri React în text de lecție. |
| Animații | Framer Motion | Folosit minimal — doar pentru intrarea hero-ului. |
| Persistență | `localStorage` | Pentru tracking progres; zero infrastructură backend. |

### 3.3. Lipsa unui backend / a unui API extern

Site-ul este **100% client-side**. Nu există server, nu există apeluri la servicii externe (OpenAI, Google etc.), nu există colectare de date despre utilizator. Această decizie are mai multe consecințe pozitive:

- **Zero cost de rulare** pe termen lung.
- **Confidențialitate completă** — nicio interacțiune a elevului nu părăsește browserul lui.
- **Independență față de servicii comerciale** — site-ul nu poate „crăpa" pentru că un API s-a oprit.
- **Originalitate** — toate widget-urile rezolvă matematica intern, fără a depinde de modele AI externe.

Pentru widget-urile care simulează un LLM (`EmbeddingPlanar`, `HalucinatiiSampling`), datele sunt pre-calculate sau alese manual de autor, fapt menționat explicit atât în lecție cât și în README.

### 3.4. Math pură în TypeScript

Toate funcțiile matematice (sigmoid, ReLU, tanh, forward pass, gradient descent) sunt scrise de la zero în TypeScript, în `src/widgets/_math/`. Nu se folosește TensorFlow.js sau alte librării de ML. Motivația:

- Pentru o rețea 2-2-1 sau pentru un neuron singular, complexitatea e trivială (~10 linii de cod).
- Evită o dependență mare (TF.js are ~1.5MB) care nu aduce nimic util pentru cazul nostru.
- Cititorul codului poate **înțelege exact ce se întâmplă** — exact ce vrem să predăm.

## 4. Arhitectura aplicației

```
[User] → React Router → SiteLayout → {
   /            → Acasa
   /lectii      → IndexLectii (listă)
   /lectii/:s/:slug → Lectie → LectieLayout (sidebar + content)
                                   ↓
                              MDX (textul lecției)
                                   ↓
                              Widget React (interactiv)
                                   ↓
                              math pură în TS
}
```

Lecțiile sunt fișiere `.mdx` care sunt încărcate la build-time prin `import.meta.glob()` (mecanismul Vite pentru import dinamic la nivel de bundle). Lista lecțiilor și metadata lor sunt declarate static în `src/lectii/manifest.ts`.

## 5. Conformitate cu regulamentul InfoEducație

| Cerință | Conformitate |
|---|---|
| Art. 1.4 — un singur autor sau echipă de max 2 | ✓ proiect individual |
| Art. 5.2 — surse complete pe GitHub | ✓ link în formularul de înscriere |
| Art. 9.1 — README cu componente neoriginale | ✓ `README.md` secțiunea „Componente neoriginale" |
| Art. 9.2 — fără plagiat | ✓ tot conținutul scris de autor; widget-urile codate de la zero |
| Art. 11.6 — lucrare publicată online | ✓ deploy pe Vercel |

## 6. Statistici tehnice

- **Linii de cod TypeScript/TSX:** ~2400
- **Linii de conținut (MDX):** ~2200 (în română)
- **Dimensiune build de producție:** ~154 KB JS gzip, ~7 KB CSS gzip
- **Numărul de dependențe runtime:** 4 (React, React DOM, React Router, Framer Motion)

> **Notă optimizare:** bundle-ul JS depășește pragul implicit de 500 KB pre-gzip. O optimizare ulterioară posibilă: lazy-loading per rută folosind `React.lazy()` și `Suspense`, care ar reduce bundle-ul inițial la sub 100 KB gzip. Nu e critic la trafic mic, dar e o îmbunătățire ușor de implementat.

## 7. Instalare și rulare

Vezi `README.md`.

## 8. Idei pentru continuare

- Pre-calcularea reală a embedding-urilor cu un model open-source pentru limba română (FastText, BERTRomanian).
- Implementarea unui tokenizator BPE real pe un mic vocabular românesc.
- Quiz-uri la sfârșitul fiecărei lecții cu întrebări multiple-choice.
- Versiune mobile-first cu interacțiune tactilă optimizată.
- Adăugarea unui capitol despre rețele convoluționale (CNN) pentru recunoaștere de imagini.
- Adăugarea unui capitol despre AI generativ (modele de difuzie pentru imagini).
- Code splitting per rută pentru un bundle inițial mai mic.
