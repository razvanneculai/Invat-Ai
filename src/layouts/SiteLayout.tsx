import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Acasă', end: true },
  { to: '/lectii', label: 'Lecții', end: false },
]

export default function SiteLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="border-b border-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <NavLink to="/" className="font-medium tracking-tight text-ink">
            Învăț <span className="text-muted">·</span> AI
          </NavLink>
          <nav className="flex gap-7 text-sm">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  isActive
                    ? 'text-ink'
                    : 'text-muted transition-colors hover:text-ink'
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <Outlet />
      </main>

    </div>
  )
}
