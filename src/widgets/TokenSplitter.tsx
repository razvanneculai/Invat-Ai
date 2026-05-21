import { useState } from 'react'

const DEFAULT_TEXT =
  'Salut, lume! Cum funcționează tokenizarea în limba română pentru un model AI?'

const SUFFIXES = ['țiune', 'urilor', 'tatea', 'urile', 'ului', 'lor', 'ile', 'ele', 'tate', 'ție']
const PREFIXES = ['inter', 'super', 'pre', 'des', 'ne', 're']

type TokenKind = 'word' | 'space' | 'punct' | 'subword'
interface Token {
  text: string
  kind: TokenKind
}

function splitWord(word: string): string[] {
  if (word.length <= 5) return [word]
  const lower = word.toLowerCase()
  for (const suf of SUFFIXES) {
    if (lower.endsWith(suf) && word.length - suf.length >= 3) {
      return [word.slice(0, -suf.length), word.slice(-suf.length)]
    }
  }
  for (const pre of PREFIXES) {
    if (lower.startsWith(pre) && word.length - pre.length >= 4) {
      return [word.slice(0, pre.length), word.slice(pre.length)]
    }
  }
  return [word]
}

function tokenize(text: string): Token[] {
  const out: Token[] = []
  let i = 0
  while (i < text.length) {
    const ch = text[i]
    if (/\s/.test(ch)) {
      out.push({ text: ch, kind: 'space' })
      i++
      continue
    }
    if (/[.,!?;:()\-—„""‚''«»…]/.test(ch)) {
      out.push({ text: ch, kind: 'punct' })
      i++
      continue
    }
    let j = i
    while (j < text.length && /[\p{L}\p{N}]/u.test(text[j])) j++
    if (j === i) {
      out.push({ text: ch, kind: 'punct' })
      i++
      continue
    }
    const word = text.slice(i, j)
    const parts = splitWord(word)
    if (parts.length === 1) {
      out.push({ text: parts[0], kind: 'word' })
    } else {
      for (const p of parts) out.push({ text: p, kind: 'subword' })
    }
    i = j
  }
  return out
}

export default function TokenSplitter() {
  const [text, setText] = useState(DEFAULT_TEXT)
  const tokens = tokenize(text)
  const visibleTokens = tokens.filter(t => t.kind !== 'space')

  return (
    <div className="not-prose my-10 border border-line bg-paper">
      <div className="flex items-baseline justify-between border-b border-line px-5 py-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          Schemă interactivă · tokenizer demonstrativ
        </p>
        <p className="font-mono text-xs text-muted">
          <span className="text-ink">{visibleTokens.length}</span> tokeni ·{' '}
          <span className="text-ink">{text.length}</span> caractere
        </p>
      </div>

      <div className="bg-paper p-5">
        <p className="mb-2 text-[11px] uppercase tracking-[0.2em] text-muted">Text de intrare</p>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={3}
          className="w-full resize-none border border-line bg-paper p-3 font-sans text-sm focus:border-ink focus:outline-none"
        />

        <p className="mb-2 mt-5 text-[11px] uppercase tracking-[0.2em] text-muted">Tokeni</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {tokens.map((t, i) => {
            if (t.kind === 'space') return <span key={i} className="px-0.5 text-muted">·</span>
            return (
              <span
                key={i}
                className={
                  t.kind === 'punct'
                    ? 'inline-block border border-line bg-soft px-2 py-1 font-mono text-xs text-muted'
                    : t.kind === 'subword'
                      ? 'inline-block border border-line border-dashed bg-paper px-2 py-1 font-mono text-xs'
                      : 'inline-block border border-ink bg-paper px-2 py-1 font-mono text-xs'
                }
              >
                {t.text}
              </span>
            )
          })}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 border-t border-line pt-5 text-xs leading-relaxed text-muted sm:grid-cols-3">
          <div>
            <span className="mr-2 inline-block border border-ink px-1.5 py-0.5 font-mono">cuvânt</span>
            Token complet
          </div>
          <div>
            <span className="mr-2 inline-block border border-line border-dashed px-1.5 py-0.5 font-mono">sub‐cuvânt</span>
            Bucată dintr-un cuvânt lung
          </div>
          <div>
            <span className="mr-2 inline-block border border-line bg-soft px-1.5 py-0.5 font-mono">,</span>
            Punctuație
          </div>
        </div>

        <p className="mt-4 text-[11px] leading-relaxed text-muted">
          Notă: tokenizator-ul real al unui LLM (de tip <span className="font-mono">BPE</span> — Byte
          Pair Encoding) își construiește vocabularul din analiza statistică a miliardelor de texte.
          Acesta de aici e o aproximare didactică, gândită să arate ideea, nu să fie exactă.
        </p>
      </div>
    </div>
  )
}
