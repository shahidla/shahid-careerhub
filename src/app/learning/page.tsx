import type { Metadata } from 'next'
import { getCertifications } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Learning & Courses — Shahid M Syed',
  description: '65 completed courses and certifications covering SAP HANA, BTP, ABAP, AI/ML, Fiori, Kyma, cloud-native development, and more.',
  alternates: { canonical: 'https://shahid-careerhub.vercel.app/learning' },
}

const NEED_REVIEW = [
  { code: 'abap1',     title: 'Introduction to ABAP in the Cloud',                             type: 'Confirmation' },
  { code: 'cp13',      title: 'Building Apps with ABAP RESTful Application Programming Model', type: 'Confirmation' },
  { code: 'btpt1',     title: 'Business Technology Platform Tutorials',                        type: 'Achievement' },
  { code: 'di1',       title: 'SAP Data Intelligence for Enterprise AI',                       type: 'Confirmation' },
  { code: 's4h27',     title: 'SAP S/4HANA Embedded Analytics',                               type: 'Confirmation' },
  { code: 'fiori-ea1', title: 'Developing and Extending SAP Fiori Elements Apps',              type: 'Confirmation' },
  { code: 'kyma1',     title: 'Kyma — A Flexible Way to Connect and Extend Applications',     type: 'Confirmation' },
  { code: 's4h7',      title: 'Extending SAP S/4HANA Cloud and SAP S/4HANA',                  type: 'Confirmation' },
]

const VERIFIED = [
  { title: 'Introduction to Software Development on SAP HANA' },
  { title: 'Introduction to Mobile Solution Development for the Enterprise' },
  { title: 'Introduction to SAP HANA Cloud Platform' },
  { title: 'ABAP Development for SAP HANA' },
  { title: "SAP's UX Strategy in a Nutshell by Sam Yen" },
  { title: 'Software Development on SAP HANA (Delta SPS 09)' },
  { title: 'Touch IoT with SAP Leonardo' },
  { title: 'Full-Text Search with SAP HANA Platform' },
  { title: 'Big Data with SAP Vora — Engines and Tools' },
  { title: 'SAP Cloud Platform Essentials (Update Q3/2017)' },
  { title: 'Enterprise Machine Learning in a Nutshell' },
  { title: 'Software Development on SAP HANA (Update Q4/2017)' },
  { title: 'Data Science in Action — Building a Predictive Churn Model' },
  { title: 'Enterprise Deep Learning with TensorFlow' },
  { title: 'SAP Leonardo Design-Led Engagements Demystified' },
  { title: 'Developing Web Apps with SAPUI5' },
  { title: 'Big Data with SAP HANA Vora' },
  { title: 'Software Development on SAP HANA (Update Q4/2016)' },
  { title: 'In-Memory Data Management In a Nutshell' },
  { title: 'Extending SAP S/4HANA Cloud and SAP S/4HANA' },
  { title: 'Understanding SAP Fiori Launchpad' },
  { title: 'Getting Started with SAP Lumira' },
  { title: 'SAP Cloud Platform Version Control with Git' },
  { title: 'Cloud-Native Development with SAP Cloud Platform' },
  { title: 'Introduction to SAP HANA Dynamic Tiering' },
  { title: 'Analytics with SAP Cloud Platform' },
  { title: 'Analyzing Connected Data with SAP HANA Graph' },
  { title: 'SAP Leonardo Design-Led Engagements Basics' },
  { title: 'SAP Leonardo — Enabling the Intelligent Enterprise' },
  { title: 'SAP HANA Data Management Suite' },
  { title: 'SAP Cloud Platform API Management' },
  { title: 'Building Applications with SAP Cloud Application Programming Model' },
  { title: 'Software Development on SAP HANA (Update Q1/2019)' },
  { title: 'Business Process Automation in SAP S/4HANA with SAP Intelligent RPA' },
]

const THIRD_PARTY = [
  { title: 'Introduction to Generative AI',                                  url: 'https://www.skills.google/public_profiles/b9acc2a0-d77f-460e-8563-8dcf38f9aa18/badges/23949633', provider: 'Google',  year: '2026', ai: true },
  { title: 'Machine Learning A-Z™: Hands-On Python & R In Data Science',    url: 'https://www.udemy.com/certificate/UC-XU3VQC5S/',                                                  provider: 'Udemy',   year: '2017', ai: true },
  { title: 'Deep Learning A-Z™: Hands-On Artificial Neural Networks',       url: 'https://www.udemy.com/certificate/UC-Q3M00N4Z/',                                                   provider: 'Udemy',   year: '2017', ai: true },
  { title: 'Deep Learning and NLP A-Z™: How to create a ChatBot',           url: 'https://www.udemy.com/certificate/UC-25OY7LT2/',                                                   provider: 'Udemy',   year: '2018', ai: true },
  { title: 'SAP Data Services (BODS) Extraction, Transformation and Loading', url: 'https://www.udemy.com/certificate/UC-HR6KIVZ0/',                                                 provider: 'Udemy',   year: '2018', ai: false },
  { title: 'SAPUI5, Fiori® and new UX (2018)',                              url: 'https://www.credential.net/m2t7h77f',                                                               provider: 'UI5CN',   year: '2018', ai: false },
  { title: 'SAP® Netweaver Gateway for SAPUI5, Fiori and HANA',             url: 'https://www.credential.net/11745242',                                                              provider: 'UI5CN',   year: '2018', ai: false },
  { title: 'SAP - Learn SAPUI5 Professional Development',                   url: 'https://www.udemy.com/certificate/UC-GE9HPPNM/',                                                   provider: 'Udemy',   year: '2018', ai: false },
  { title: 'SAP CPI for Beginners with Hands-On',                           url: 'https://www.udemy.com/certificate/UC-89fb1c02-44fe-4905-844a-feac1f1f7fa2/',                       provider: 'Udemy',   year: '2025', ai: false },
  { title: 'SAP BRFplus',                                                   url: 'https://www.udemy.com/certificate/UC-16X74S0K',                                                    provider: 'Udemy',   year: '2018', ai: false },
  { title: 'HADOOP Starter Kit',                                            url: 'https://ude.my/UC-380MKF9F',                                                                       provider: 'Udemy',   year: '2017', ai: false },
  { title: 'The Complete Node.js Developer Course',                         url: 'http://ude.my/UC-XDL8U3N2',                                                                        provider: 'Udemy',   year: '2017', ai: false },
  { title: 'AWS Concepts',                                                  url: 'https://www.udemy.com/certificate/UC-W6XGQEOQ/',                                                   provider: 'Udemy',   year: '2018', ai: false },
  { title: 'AWS Essentials',                                                url: 'https://www.udemy.com/certificate/UC-9HKXA8T6/',                                                   provider: 'Udemy',   year: '2018', ai: false },
]

export default async function LearningPage() {
  const certifications = await getCertifications()
  const sapCerts = certifications.filter(c => c.issuer === 'SAP')
  const total = sapCerts.length + THIRD_PARTY.length + NEED_REVIEW.length + VERIFIED.length

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-14">

      <section>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">Continuous Learning</p>
        <h1 className="text-4xl font-bold tracking-tight">Learning &amp; Courses</h1>
        <p className="mt-3 text-lg text-gray-600">
          {total} completed courses and certifications covering SAP HANA, BTP, ABAP, AI/ML, Fiori, Kyma, cloud-native development, and more.
        </p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm text-gray-500">
          <a href="#sap-certifications" className="hover:text-gray-700"><strong className="text-gray-900">{sapCerts.length}</strong> SAP certifications</a>
          <a href="#third-party" className="hover:text-gray-700"><strong className="text-gray-900">{THIRD_PARTY.length}</strong> third-party certificates</a>
          <a href="#confirmations" className="hover:text-gray-700"><strong className="text-gray-900">{NEED_REVIEW.length}</strong> OpenSAP confirmations</a>
          <a href="#records-of-achievement" className="hover:text-gray-700"><strong className="text-gray-900">{VERIFIED.length}</strong> OpenSAP records of achievement</a>
        </div>
      </section>

      {/* SAP Certifications */}
      <section id="sap-certifications">
        <h2 className="text-xs font-semibold text-blue-500 uppercase tracking-widest mb-5">SAP Certifications</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {certifications.map((c) => (
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
          {THIRD_PARTY.map((c) => (
            <a key={c.title} href={c.url} target="_blank" rel="noopener noreferrer"
              className="border border-gray-100 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors block">
              <p className="text-sm font-medium text-gray-900 leading-snug hover:text-blue-700">{c.title}</p>
              <div className="mt-1 flex items-center gap-2">
                <p className="text-xs text-gray-400">{c.provider} · {c.year}</p>
                {c.ai && <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">AI</span>}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Confirmations */}
      <section id="confirmations">
        <h2 className="text-xs font-semibold text-purple-500 uppercase tracking-widest mb-5">Confirmations</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {NEED_REVIEW.map((c) => (
            <div key={c.code} className="border border-purple-100 rounded-lg p-4 bg-white">
              <p className="text-sm font-medium text-gray-900 leading-snug">{c.title}</p>
              <p className="mt-1 text-xs text-purple-600">{c.type}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Records of Achievement */}
      <section id="records-of-achievement">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Records of Achievement — OpenSAP</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {VERIFIED.map((c) => (
            <div key={c.title} className="border border-gray-100 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors">
              <p className="text-sm font-medium text-gray-900 leading-snug">{c.title}</p>
              <p className="mt-1 text-xs text-gray-400">Record of Achievement · OpenSAP</p>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
