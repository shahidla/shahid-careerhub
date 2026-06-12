const FOOTER_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/resume', label: 'Resume' },
  { href: '/ai', label: 'AI Portfolio' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/patent', label: 'Patent' },
  { href: '/blogs', label: 'Blog' },
  { href: '/dashboard', label: 'Dashboard Demo' },
  { href: '/learning', label: 'Learning' },
  { href: '/chat', label: 'Resume Chat' },
]

const SOCIAL_LINKS = [
  { href: 'https://www.linkedin.com/in/shahidmsyed/', label: 'LinkedIn' },
  { href: 'https://github.com/shahidla', label: 'GitHub' },
  { href: 'https://community.sap.com/t5/user/viewprofilepage/user-id/15422', label: 'SAP Community' },
  { href: 'mailto:shahid.la@gmail.com', label: 'Email' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-surface-300/30 bg-surface-50 mt-20 relative">
      {/* Gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-purple/40 to-transparent" />

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-wrap justify-between gap-10">
          <div>
            <p className="font-display font-bold text-text text-lg tracking-tight">
              <span className="gradient-text-static">S</span>hahid M Syed
            </p>
            <p className="text-sm text-text-subtle mt-1.5">SAP Development Architect · AI Engineer</p>
          </div>
          <nav aria-label="Footer navigation">
            <p className="text-xs font-semibold text-text-subtle uppercase tracking-widest mb-3">Pages</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 list-none m-0 p-0">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="text-sm text-text-subtle hover:text-text-muted transition-colors duration-200">{label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Social links">
            <p className="text-xs font-semibold text-text-subtle uppercase tracking-widest mb-3">Connect</p>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 list-none m-0 p-0">
              {SOCIAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="text-sm text-text-subtle hover:text-accent-purple transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-10 pt-6 border-t border-surface-300/20 flex items-center justify-between">
          <p className="text-xs text-text-subtle">© {new Date().getFullYear()} Shahid M Syed</p>
          <p className="text-xs text-text-subtle">Built with Next.js · Powered by AI</p>
        </div>
      </div>
    </footer>
  )
}
