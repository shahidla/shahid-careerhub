import type { Metadata } from 'next'
import { getCertifications } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Learning & Courses — Shahid M Syed',
  description: 'Completed courses and certifications covering SAP HANA, BTP, ABAP, AI/ML, Fiori, Kyma, cloud-native development, and more.',
  alternates: { canonical: 'https://shahid-careerhub.vercel.app/learning' },
}

export default async function LearningPage() {
  const all = await getCertifications()

  const sapCerts    = all.filter(c => c.issuer === 'SAP')
  const thirdParty  = all.filter(c => !['SAP', 'OpenSAP'].includes(c.issuer))
  const confirmations = all.filter(c => c.issuer === 'OpenSAP' && c.category === 'Confirmation')
  const roa         = all.filter(c => c.issuer === 'OpenSAP' && c.category === 'Record of Achievement')
  const total       = all.length

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-14">

      <section>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">Continuous Learning</p>
        <h1 className="text-4xl font-bold tracking-tight">Learning &amp; Courses</h1>
        <p className="mt-3 text-lg text-gray-600">
          {total} completed courses and certifications covering SAP HANA, BTP, ABAP, AI/ML, Fiori, Kyma, cloud-native development, and more.
        </p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-500">
          <a href="#sap-certifications"     className="hover:text-gray-700"><strong className="text-gray-900">{sapCerts.length}</strong> SAP certifications</a>
          <a href="#third-party"            className="hover:text-gray-700"><strong className="text-gray-900">{thirdParty.length}</strong> third-party certificates</a>
          <a href="#confirmations"          className="hover:text-gray-700"><strong className="text-gray-900">{confirmations.length}</strong> OpenSAP confirmations</a>
          <a href="#records-of-achievement" className="hover:text-gray-700"><strong className="text-gray-900">{roa.length}</strong> OpenSAP records of achievement</a>
        </div>
      </section>

      {/* SAP Certifications */}
      <section id="sap-certifications">
        <h2 className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-5">SAP Certifications</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {sapCerts.map((c) => (
            <a key={c.id} href={c.credential_url} target="_blank" rel="noopener noreferrer"
              className="border border-blue-100 rounded-lg p-4 bg-white hover:border-blue-300 transition-colors block">
              <p className="text-sm font-medium text-gray-900 leading-snug hover:text-blue-700">{c.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xs text-gray-400">{c.issuer}{c.code ? ` · ${c.code}` : ''}</p>
                {c.is_ai && <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">AI</span>}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Third-party certificates */}
      <section id="third-party">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Third-Party Certificates</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {thirdParty.map((c) => (
            <a key={c.id} href={c.credential_url} target="_blank" rel="noopener noreferrer"
              className="border border-gray-100 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors block">
              <p className="text-sm font-medium text-gray-900 leading-snug hover:text-blue-700">{c.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xs text-gray-400">{c.issuer}{c.year ? ` · ${c.year}` : ''}{c.code ? ` · ${c.code}` : ''}</p>
                {c.is_ai && <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">AI</span>}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* OpenSAP Confirmations */}
      <section id="confirmations">
        <h2 className="text-xs font-semibold text-purple-500 uppercase tracking-widest mb-5">Confirmations — OpenSAP</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {confirmations.map((c) => (
            <a key={c.id} href={c.credential_url} target="_blank" rel="noopener noreferrer"
              className="border border-purple-100 rounded-lg p-4 bg-white hover:border-purple-300 transition-colors block">
              <p className="text-sm font-medium text-gray-900 leading-snug hover:text-purple-700">{c.title}</p>
              <p className="mt-1 text-xs text-purple-600">Confirmation · OpenSAP</p>
            </a>
          ))}
        </div>
      </section>

      {/* Records of Achievement */}
      <section id="records-of-achievement">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Records of Achievement — OpenSAP</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {roa.map((c) => (
            <a key={c.id} href={c.credential_url} target="_blank" rel="noopener noreferrer"
              className="border border-gray-100 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors block">
              <p className="text-sm font-medium text-gray-900 leading-snug hover:text-blue-700">{c.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xs text-gray-400">Record of Achievement · OpenSAP</p>
                {c.is_ai && <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">AI</span>}
              </div>
            </a>
          ))}
        </div>
      </section>

    </main>
  )
}
