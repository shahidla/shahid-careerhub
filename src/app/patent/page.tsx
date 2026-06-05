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
        <p className="text-sm font-semibold text-accent-purple uppercase tracking-widest animate-fade-in">Intellectual Property</p>
        <h1 className="text-4xl font-display font-bold tracking-tight text-gray-100 animate-fade-in-up">Granted Patent</h1>
        <p className="text-lg text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          US patent granted for a real-time speech and predictive analytics accessibility application built on SAP HANA.
        </p>
      </section>

      <section className="glass-card p-8 border-accent-blue/20 bg-accent-blue/[0.02] hover:border-accent-blue/40 space-y-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-accent-blue uppercase tracking-widest">Patent Number</p>
          <a
            href="https://patents.google.com/patent/US10304013B2/en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl font-display font-bold text-gray-100 hover:text-accent-blue transition-colors"
          >
            US10304013B2
          </a>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Title</p>
          <p className="text-gray-100 font-medium leading-relaxed">
            Real-Time Speech Processing and Predictive Analytics for Accessibility
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Inventor</p>
            <p className="text-gray-200">Shahid Mohammed Syed</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Assignee</p>
            <p className="text-gray-200">SAP SE</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1.5">Status</p>
            <span className="inline-block text-xs font-semibold bg-accent-emerald/20 text-accent-emerald px-2 py-0.5 rounded border border-accent-emerald/30">Granted</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Grant Date</p>
            <p className="text-gray-200">29 May 2018</p>
          </div>
        </div>

        <a
          href="https://patents.google.com/patent/US10304013B2/en"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-accent-blue hover:text-blue-400 transition-colors"
        >
          View on Google Patents →
        </a>
      </section>

      <section className="space-y-4">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.15em]">What it does</h2>
        <div className="space-y-3 text-sm text-gray-300 leading-relaxed">
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
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.15em]">Origin</h2>
        <p className="text-sm text-gray-300 leading-relaxed">
          Built at the SAP <em>What the Hack 2.0!</em> hackathon at SAP Labs India. The project was a finalist at the event
          and was subsequently filed as a patent by SAP SE, with Shahid named as inventor.
          Related work from this period also won the{' '}
          <strong>Google TensorFlow IoT Challenge 2017</strong> at SAP Labs.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.15em]">Technologies</h2>
        <div className="flex flex-wrap gap-2">
          {['SAP HANA', 'Predictive Analytics', 'Speech Recognition', 'Accessibility', 'Machine Learning', 'SAP UI5'].map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      </section>

    </main>
  )
}
