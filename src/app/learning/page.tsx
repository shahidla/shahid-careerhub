import type { Metadata } from 'next'
import { getCertifications } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Learning & Courses - Shahid M Syed',
  description: 'Completed courses and certifications covering SAP HANA, BTP, ABAP, AI/ML, Fiori, Kyma, cloud-native development, and more.',
  alternates: { canonical: 'https://shahid-careerhub.vercel.app/learning' },
}

export default async function LearningPage() {
  const all = await getCertifications()

  const sapCerts = all.filter((certification) => certification.issuer === 'SAP')
  const thirdParty = all.filter((certification) => !['SAP', 'OpenSAP'].includes(certification.issuer))
  const confirmations = all.filter((certification) => certification.issuer === 'OpenSAP' && certification.category === 'Confirmation')
  const roa = all.filter((certification) => certification.issuer === 'OpenSAP' && certification.category === 'Record of Achievement')
  const total = all.length

  return (
    <main className="mx-auto max-w-4xl space-y-14 px-6 py-12">
      <section className="animate-fade-in">
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-accent-purple">Continuous Learning</p>
        <h1 className="text-4xl font-display font-bold tracking-tight text-text">Learning &amp; Courses</h1>
        <p className="mt-3 text-lg text-text-subtle leading-relaxed">
          {total} completed courses and certifications covering SAP HANA, BTP, ABAP, AI/ML, Fiori, Kyma, cloud-native development, and more.
        </p>
        <div className="mt-4">
          <a href="/certifications" className="text-sm font-medium text-accent-blue hover:text-accent-blue/80 transition-colors">
            Prefer the recruiter-friendly view? Open the full certifications index →
          </a>
        </div>
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-text-subtle">
          <a href="#sap-certifications" className="hover:text-text-subtle transition-colors">
            <strong className="text-text-muted">{sapCerts.length}</strong> SAP certifications
          </a>
          <a href="#third-party" className="hover:text-text-subtle transition-colors">
            <strong className="text-text-muted">{thirdParty.length}</strong> third-party certificates
          </a>
          <a href="#confirmations" className="hover:text-text-subtle transition-colors">
            <strong className="text-text-muted">{confirmations.length}</strong> OpenSAP confirmations
          </a>
          <a href="#records-of-achievement" className="hover:text-text-subtle transition-colors">
            <strong className="text-text-muted">{roa.length}</strong> OpenSAP records of achievement
          </a>
        </div>
      </section>

      <section id="sap-certifications">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-accent-blue">SAP Certifications</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {sapCerts.map((certification) => (
            <a
              key={certification.id}
              href={certification.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-accent-blue/20 bg-accent-blue/[0.02] p-4 transition-all duration-300 hover:border-accent-blue/40"
            >
              <p className="text-sm font-medium leading-snug text-text-muted hover:text-accent-blue transition-colors">{certification.title}</p>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-xs text-text-subtle">{certification.issuer}{certification.code ? ` · ${certification.code}` : ''}</p>
                {certification.is_ai && <span className="rounded bg-accent-purple/15 border border-accent-purple/20 px-1.5 py-0.5 text-xs text-accent-purple">AI</span>}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="third-party">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-text-subtle">Third-Party Certificates</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {thirdParty.map((certification) => (
            <a
              key={certification.id}
              href={certification.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-surface-300/40 bg-surface-100/50 p-4 transition-all duration-300 hover:border-surface-400"
            >
              <p className="text-sm font-medium leading-snug text-text-muted hover:text-accent-blue transition-colors">{certification.title}</p>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-xs text-text-subtle">
                  {certification.issuer}
                  {certification.year ? ` · ${certification.year}` : ''}
                  {certification.code ? ` · ${certification.code}` : ''}
                </p>
                {certification.is_ai && <span className="rounded bg-accent-purple/15 border border-accent-purple/20 px-1.5 py-0.5 text-xs text-accent-purple">AI</span>}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="confirmations">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-accent-purple">Confirmations · OpenSAP</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {confirmations.map((certification) => (
            <a
              key={certification.id}
              href={certification.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-accent-purple/20 bg-accent-purple/[0.02] p-4 transition-all duration-300 hover:border-accent-purple/40"
            >
              <p className="text-sm font-medium leading-snug text-text-muted hover:text-accent-purple transition-colors">{certification.title}</p>
              <p className="mt-2 text-xs text-accent-purple">Confirmation · OpenSAP</p>
            </a>
          ))}
        </div>
      </section>

      <section id="records-of-achievement">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-text-subtle">Records of Achievement · OpenSAP</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {roa.map((certification) => (
            <a
              key={certification.id}
              href={certification.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-surface-300/40 bg-surface-100/50 p-4 transition-all duration-300 hover:border-surface-400"
            >
              <p className="text-sm font-medium leading-snug text-text-muted hover:text-accent-blue transition-colors">{certification.title}</p>
              <div className="mt-2 flex items-center gap-2">
                <p className="text-xs text-text-subtle">Record of Achievement · OpenSAP</p>
                {certification.is_ai && <span className="rounded bg-accent-purple/15 border border-accent-purple/20 px-1.5 py-0.5 text-xs text-accent-purple">AI</span>}
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
