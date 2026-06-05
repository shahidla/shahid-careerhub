'use client'

import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/',               label: 'Home' },
  { href: '/resume',         label: 'Resume' },
  { href: '/ai',             label: 'AI Portfolio' },
  { href: '/blogs',          label: 'Blog' },
  { href: '/patent',         label: 'Patent' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/dashboard',      label: 'Dashboard' },
]

export default function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="border-b border-surface-300/40 bg-surface/80 backdrop-blur-xl sticky top-0 z-20">
      <nav
        className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-6 text-sm"
        aria-label="Primary navigation"
      >
        <a href="/" className="font-display font-bold text-gray-100 hover:text-accent-purple transition-colors shrink-0 text-base tracking-tight">
          <span className="gradient-text-static">S</span>hahid
        </a>
        <ul className="flex flex-wrap items-center gap-0.5 list-none m-0 p-0">
          {NAV.map(({ href, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <a
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-surface-200 text-gray-100 font-medium shadow-sm shadow-accent-purple/10 border border-surface-300/60'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-surface-200/50'
                  }`}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
