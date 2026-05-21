import type { ReactNode } from 'react'

export default function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center border border-line px-2.5 py-1 text-[11px] font-medium tracking-wide text-muted">
      {children}
    </span>
  )
}
