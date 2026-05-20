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
      <section>
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-500">Continuous Learning</p>
        <h1 className="text-4xl font-bold tracking-tight">Learning &amp; Courses</h1>
        <p className="mt-3 text-lg text-gray-600">
          {total} completed courses and certifications covering SAP HANA, BTP, ABAP, AI/ML, Fiori, Kyma, cloud-native development, and more.
        </p>
        <div className="mt-4">
          <a href="/certifications" className="text-sm font-medium text-blue-600 hover:underline">
            Prefer the recruiter-friendly view? Open the full certifications index →
          </a>
        </div>
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-500">
          <a href="#sap-certifications" className="hover:text-gray-700">
            <strong className="text-gray-900">{sapCerts.length}</strong> SAP certifications
          </a>
          <a href="#third-party" className="hover:text-gray-700">
            <strong className="text-gray-900">{thirdParty.length}</strong> third-party certificates
          </a>
          <a href="#confirmations" className="hover:text-gray-700">
            <strong className="text-gray-900">{confirmations.length}</strong> OpenSAP confirmations
          </a>
          <a href="#records-of-achievement" className="hover:text-gray-700">
            <strong className="text-gray-900">{roa.length}</strong> OpenSAP records of achievement
          </a>
        </div>
      </section>

      <section id="sap-certifications">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-blue-500">SAP Certifications</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {sapCerts.map((certification) => (
            <a
              key={certification.id}
              href={certification.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-blue-100 bg-white p-4 transition-colors hover:border-blue-300"
            >
              <p className="text-sm font-medium leading-snug text-gray-900 hover:text-blue-700">{certification.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xs text-gray-400">{certification.issuer}{certification.code ? ` · ${certification.code}` : ''}</p>
                {certification.is_ai && <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-600">AI</span>}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="third-party">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-400">Third-Party Certificates</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {thirdParty.map((certification) => (
            <a
              key={certification.id}
              href={certification.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-gray-100 bg-white p-4 transition-colors hover:border-gray-300"
            >
              <p className="text-sm font-medium leading-snug text-gray-900 hover:text-blue-700">{certification.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xs text-gray-400">
                  {certification.issuer}
                  {certification.year ? ` · ${certification.year}` : ''}
                  {certification.code ? ` · ${certification.code}` : ''}
                </p>
                {certification.is_ai && <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-600">AI</span>}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="confirmations">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-purple-500">Confirmations - OpenSAP</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {confirmations.map((certification) => (
            <a
              key={certification.id}
              href={certification.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-purple-100 bg-white p-4 transition-colors hover:border-purple-300"
            >
              <p className="text-sm font-medium leading-snug text-gray-900 hover:text-purple-700">{certification.title}</p>
              <p className="mt-1 text-xs text-purple-600">Confirmation · OpenSAP</p>
            </a>
          ))}
        </div>
      </section>

      <section id="records-of-achievement">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-gray-400">Records of Achievement - OpenSAP</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {roa.map((certification) => (
            <a
              key={certification.id}
              href={certification.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-gray-100 bg-white p-4 transition-colors hover:border-gray-300"
            >
              <p className="text-sm font-medium leading-snug text-gray-900 hover:text-blue-700">{certification.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xs text-gray-400">Record of Achievement · OpenSAP</p>
                {certification.is_ai && <span className="rounded bg-purple-100 px-1.5 py-0.5 text-xs text-purple-600">AI</span>}
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
