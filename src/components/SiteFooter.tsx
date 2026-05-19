const FOOTER_LINKS = [
  { href: '/',          label: 'Home' },
  { href: '/resume',    label: 'Resume' },
  { href: '/ai',        label: 'AI Portfolio' },
  { href: '/blogs',     label: 'Blog' },
  { href: '/dashboard', label: 'Dashboard Demo' },
  { href: '/learning',  label: 'Learning' },
  { href: '/chat',      label: 'Chat' },
]

const SOCIAL_LINKS = [
  { href: 'https://www.linkedin.com/in/shahidmsyed/', label: 'LinkedIn' },
  { href: 'https://github.com/shahidla',              label: 'GitHub' },
  { href: 'https://community.sap.com/t5/user/viewprofilepage/user-id/15422', label: 'SAP Community' },
  { href: 'mailto:syedsm@gmail.com',                  label: 'Email' },
]

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-20">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-wrap justify-between gap-8">
          <div>
            <p className="font-semibold text-gray-900">Shahid M Syed</p>
            <p className="text-sm text-gray-500 mt-1">SAP Development Architect · AI Engineer</p>
          </div>
          <nav aria-label="Footer navigation">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Pages</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 list-none m-0 p-0">
              {FOOTER_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="text-sm text-gray-500 hover:text-gray-900">{label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Social links">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Connect</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2 list-none m-0 p-0">
              {SOCIAL_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-gray-900">{label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 text-xs text-gray-400">© {new Date().getFullYear()} Shahid M Syed</p>
      </div>
    </footer>
  )
}
