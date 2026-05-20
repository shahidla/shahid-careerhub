import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Patent US10304013B2 — Shahid M Syed',
  description: 'Granted US patent US10304013B2 for a click-free real-time speech and predictive analytics application for accessibility, built on SAP HANA.',
  alternates: { canonical: 'https://shahid-careerhub.vercel.app/patent' },
}

export default function PatentPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">

      <section className="space-y-4">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">Intellectual Property</p>
        <h1 className="text-4xl font-bold tracking-tight">Granted Patent</h1>
        <p className="text-lg text-gray-600">
          US patent granted for a real-time speech and predictive analytics accessibility application built on SAP HANA.
        </p>
      </section>

      <section className="border border-blue-100 rounded-2xl p-8 bg-blue-50/40 space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-blue-500 uppercase tracking-widest">Patent Number</p>
          <a
            href="https://patents.google.com/patent/US10304013B2/en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-bold text-gray-900 hover:text-blue-700"
          >
            US10304013B2
          </a>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Title</p>
          <p className="text-gray-900 font-medium">
            Real-Time Speech Processing and Predictive Analytics for Accessibility
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Inventor</p>
            <p className="text-gray-900">Shahid Mohammed Syed</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Assignee</p>
            <p className="text-gray-900">SAP SE</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Status</p>
            <span className="inline-block text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded">Granted</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Grant Date</p>
            <p className="text-gray-900">29 May 2018</p>
          </div>
        </div>

        <a
          href="https://patents.google.com/patent/US10304013B2/en"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          View on Google Patents →
        </a>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">What it does</h2>
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            The patent covers a system that enables people with physical disabilities to interact with complex enterprise
            software — specifically SAP HANA — using only their voice, with no mouse or keyboard required.
          </p>
          <p>
            The invention processes real-time speech input, converts it to structured queries, executes them against
            SAP HANA, and returns predictive analytics results — all without any direct GUI interaction.
          </p>
          <p>
            The core innovation is the combination of continuous speech recognition, natural language intent parsing,
            HANA-native predictive model execution, and result narration in a single low-latency pipeline — making
            enterprise analytics genuinely accessible to differently-abled users.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Origin</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          Built at the SAP <em>What the Hack 2.0!</em> hackathon at SAP Labs India. The project was a finalist at the event
          and was subsequently filed as a patent by SAP SE, with Shahid named as inventor.
          Related work from this period also won the{' '}
          <strong>Google TensorFlow IoT Challenge 2017</strong> at SAP Labs.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Technologies</h2>
        <div className="flex flex-wrap gap-2">
          {['SAP HANA', 'Predictive Analytics', 'Speech Recognition', 'Accessibility', 'Machine Learning', 'SAP UI5'].map((t) => (
            <span key={t} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">{t}</span>
          ))}
        </div>
      </section>

      <section className="border-t border-gray-100 pt-6 flex flex-wrap gap-6 text-sm">
        <a href="/resume#awards" className="text-gray-500 hover:text-gray-900">← Back to Resume</a>
        <a href="/ai#projects" className="text-gray-500 hover:text-gray-900">AI Portfolio</a>
      </section>

    </main>
  )
}
