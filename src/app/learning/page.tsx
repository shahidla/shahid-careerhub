import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Learning & Courses — Shahid M Syed',
  description: '42 completed OpenSAP courses covering SAP HANA, BTP, ABAP, AI, ML, Fiori, Kyma, and more.',
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

export default function LearningPage() {
  const total = NEED_REVIEW.length + VERIFIED.length

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-14">

      <section>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-2">Continuous Learning</p>
        <h1 className="text-4xl font-bold tracking-tight">Learning &amp; Courses</h1>
        <p className="mt-3 text-lg text-gray-600">
          {total} completed OpenSAP courses covering SAP HANA, BTP, ABAP, AI/ML, Fiori, Kyma, and cloud-native development.
        </p>
        <div className="mt-6 flex gap-6 text-sm text-gray-500">
          <span><strong className="text-gray-900">{total}</strong> courses completed</span>
          <span><strong className="text-gray-900">{VERIFIED.length}</strong> records of achievement</span>
          <span><strong className="text-gray-900">{NEED_REVIEW.length}</strong> confirmations of participation</span>
        </div>
      </section>

      {/* Recent / notable */}
      <section>
        <h2 className="text-xs font-semibold text-purple-500 uppercase tracking-widest mb-5">Recent &amp; Notable</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {NEED_REVIEW.map((c) => (
            <div key={c.code} className="border border-purple-100 rounded-lg p-4 bg-white">
              <p className="text-sm font-medium text-gray-900 leading-snug">{c.title}</p>
              <p className="mt-1 text-xs text-purple-600">{c.type}</p>
            </div>
          ))}
        </div>
      </section>

      {/* All verified courses */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Records of Achievement</h2>
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
