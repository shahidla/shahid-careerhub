'use client'

import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/',               label: 'Home' },
  { href: '/resume',         label: 'Resume' },
  { href: '/ai',             label: 'AI Portfolio' },
  { href: '/blogs',          label: 'Blog' },
  { href: '/patent',         label: 'Patent' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/dashboard',      label: 'Dashboard Demo' },
]

export default function SiteHeader() {
  const pathname = usePathname()

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-20">
      <nav
        className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between gap-6 text-sm"
        aria-label="Primary navigation"
      >
        <a href="/" className="font-semibold text-gray-900 hover:text-blue-600 shrink-0">
          Shahid M Syed
        </a>
        <ul className="flex flex-wrap items-center gap-1 list-none m-0 p-0">
          {NAV.map(({ href, label }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
            return (
              <li key={href}>
                <a
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    active
                      ? 'bg-gray-100 text-gray-900 font-medium'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
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
