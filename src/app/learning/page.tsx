import type { Metadata } from 'next'
import { getCertifications } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Learning & Courses — Shahid M Syed',
  description: '69 completed courses and certifications covering SAP HANA, BTP, ABAP, AI/ML, Fiori, Kyma, cloud-native development, and more.',
  alternates: { canonical: 'https://shahid-careerhub.vercel.app/learning' },
}

const NEED_REVIEW = [
  { code: 'abap1',     title: 'Introduction to ABAP in the Cloud',                             type: 'Confirmation', url: 'https://drive.google.com/uc?export=download&id=1dEJOSBqrqa48IV9Q9Pehf6gHm0_QMHk3' },
  { code: 'cp13',      title: 'Building Apps with ABAP RESTful Application Programming Model', type: 'Confirmation', url: 'https://drive.google.com/uc?export=download&id=19AwZyWrIFOOnS-bVTAJwTEypA1JqB5XA' },
  { code: 'btpt1',     title: 'Business Technology Platform Tutorials',                        type: 'Achievement',  url: 'https://drive.google.com/uc?export=download&id=1gKxfdcOPuod23Md-2nYnS5NCWGYd-owo' },
  { code: 'di1',       title: 'SAP Data Intelligence for Enterprise AI',                       type: 'Confirmation', url: 'https://drive.google.com/uc?export=download&id=1bKJPGIf9TK4psE_0t1QqQS8Oq01WVLBI' },
  { code: 's4h27',     title: 'SAP S/4HANA Embedded Analytics',                               type: 'Confirmation', url: 'https://drive.google.com/uc?export=download&id=1lnFqXdLMQ2ivNw31JskJbvZoHyeDSF3D' },
  { code: 'fiori-ea1', title: 'Developing and Extending SAP Fiori Elements Apps',              type: 'Confirmation', url: 'https://drive.google.com/uc?export=download&id=1L_XxPTBvecqR4P20NhhhgVA9fpoveZU2' },
  { code: 'kyma1',     title: 'Kyma — A Flexible Way to Connect and Extend Applications',     type: 'Confirmation', url: 'https://drive.google.com/uc?export=download&id=1qr3AikErvW3UE3tOTUyJlDkFqH1iGsPD' },
  { code: 's4h7',      title: 'Extending SAP S/4HANA Cloud and SAP S/4HANA',                  type: 'Confirmation', url: 'https://drive.google.com/uc?export=download&id=14Vyh1QuuWxxRg9_db_YpvM4okEenOBQV' },
]

const VERIFIED = [
  { title: 'Discovering DevOps with SAP BTP', url: 'https://www.credly.com/badges/035b2032-8e72-43b3-b01e-2f6bad138d7f/linked_in_profile' },
  { title: 'Getting Started with In-App Extensibility in SAP S/4HANA', url: 'https://www.credly.com/badges/2593cf46-e02e-454c-9bf4-58c3fb14e051/linked_in_profile' },
  { title: 'Getting Started with Creating an SAP Fiori Elements App Based on an OData V4 RAP Service', url: 'https://www.credly.com/badges/18418051-df5e-4c6d-817f-1130952f4686/linked_in_profile' },
  { title: 'Introduction to Software Development on SAP HANA',                    url: 'https://drive.google.com/uc?export=download&id=1DX44eleP_L9Mflw5vVg6_siamX_eK4Nk' },
  { title: 'Introduction to Mobile Solution Development for the Enterprise',       url: 'https://drive.google.com/uc?export=download&id=1VMrMHpF_tXHiABCebuuBV1bHQjK3dj7b' },
  { title: 'Introduction to SAP HANA Cloud Platform',                             url: 'https://drive.google.com/uc?export=download&id=1JY-OWnhXItnIZFQ3c3-Yp_fQOfbHxveL' },
  { title: 'ABAP Development for SAP HANA',                                       url: 'https://drive.google.com/uc?export=download&id=1jk7x8ooeepE5fqJ5n-QhwnWMXU1WXt0f' },
  { title: "SAP's UX Strategy in a Nutshell by Sam Yen",                          url: 'https://drive.google.com/uc?export=download&id=1guKgUY1_c1zPu38MubnORc9sL9PpL6o5' },
  { title: 'Software Development on SAP HANA (Delta SPS 09)',                     url: 'https://drive.google.com/uc?export=download&id=1_AryGTrAcSS20FjoSGlVJhVEJsrF2RKI' },
  { title: 'Touch IoT with SAP Leonardo',                                         url: 'https://drive.google.com/uc?export=download&id=19BC1vp2sTwOafIsltXAEO5Y9l83lTjpY' },
  { title: 'Full-Text Search with SAP HANA Platform',                             url: 'https://drive.google.com/uc?export=download&id=1YwRNH0H325E-h0ylMkdyM9IlZxb--9Wf' },
  { title: 'Big Data with SAP Vora — Engines and Tools',                          url: 'https://drive.google.com/uc?export=download&id=18KI-0rQx0eRdkzBuwKKCo-_IlrJkntOC' },
  { title: 'SAP Cloud Platform Essentials (Update Q3/2017)',                      url: 'https://drive.google.com/uc?export=download&id=1kYSUP1BPKEe91KHZqIgLYveppK1-z0r_' },
  { title: 'Enterprise Machine Learning in a Nutshell',                           url: 'https://drive.google.com/uc?export=download&id=147fbc7XBr1k5xu6SR7KKxqEnAaRnn2Ql' },
  { title: 'Software Development on SAP HANA (Update Q4/2017)',                   url: 'https://drive.google.com/uc?export=download&id=19qViaBbC0ro06cuEiw7NEmxMvNYN4TF1' },
  { title: 'Data Science in Action — Building a Predictive Churn Model',          url: 'https://drive.google.com/uc?export=download&id=1AWuPst3zrmbXt1yA2KJP_86L6GOVT7eN' },
  { title: 'Enterprise Deep Learning with TensorFlow',                            url: 'https://drive.google.com/uc?export=download&id=1o3IL9jbfXYPKHwQEke-g2dxLNb4jmLOL' },
  { title: 'SAP Leonardo Design-Led Engagements Demystified',                     url: 'https://drive.google.com/uc?export=download&id=13otDNCaYM76LB7ThaP-mWbWpGPhcHP1t' },
  { title: 'Developing Web Apps with SAPUI5',                                     url: 'https://drive.google.com/uc?export=download&id=1YADgUVD6hXLlOl-3cTcFt-cOzKIfut-K' },
  { title: 'Big Data with SAP HANA Vora',                                         url: 'https://drive.google.com/uc?export=download&id=135fPskPN3hLA8VLr72vZgGE4IUot2afA' },
  { title: 'Software Development on SAP HANA (Update Q4/2016)',                   url: 'https://drive.google.com/uc?export=download&id=1PSWl18E8XHTUR6APYxB1Qnak77SlMncA' },
  { title: 'In-Memory Data Management In a Nutshell',                             url: 'https://drive.google.com/uc?export=download&id=1gr2fp3W88ZA3FwFUbuDEjV17sTvKo3Hh' },
  { title: 'Extending SAP S/4HANA Cloud and SAP S/4HANA',                         url: 'https://drive.google.com/uc?export=download&id=1qsjW55EDmzynALCYeyrhNhYCQdRqZ2JW' },
  { title: 'Understanding SAP Fiori Launchpad',                                   url: 'https://drive.google.com/uc?export=download&id=1RxsB44N07ubToXTazux95rPcTs_Xsat6' },
  { title: 'Getting Started with SAP Lumira',                                     url: 'https://drive.google.com/uc?export=download&id=1m54homwn-J2m566wrsVCQfrwaNGpjaWB' },
  { title: 'SAP Cloud Platform Version Control with Git',                         url: 'https://drive.google.com/uc?export=download&id=1ybn4PDItwrsCoYfv4NXVY0yxU-Tw13kw' },
  { title: 'Cloud-Native Development with SAP Cloud Platform',                    url: 'https://drive.google.com/uc?export=download&id=1ILMbfEk_UQZylzSPDaAkABci4tfXihau' },
  { title: 'Introduction to SAP HANA Dynamic Tiering',                            url: 'https://drive.google.com/uc?export=download&id=1v_eAu8TOUwHXE1Ng3fZ4PpFB5GFAqR9R' },
  { title: 'Analytics with SAP Cloud Platform',                                   url: 'https://drive.google.com/uc?export=download&id=1kDm35bjDC6VR7qldSyoxbrKhDV-ibtHM' },
  { title: 'Analyzing Connected Data with SAP HANA Graph',                        url: 'https://drive.google.com/uc?export=download&id=1wun-jhwgayTh0gobOcD6MEtIM2GWAlpQ' },
  { title: 'SAP Leonardo Design-Led Engagements Basics',                          url: 'https://drive.google.com/uc?export=download&id=1yJQd-gcPzHom0z9SfFozhjytcZIcPsHx' },
  { title: 'SAP Leonardo — Enabling the Intelligent Enterprise',                  url: 'https://drive.google.com/uc?export=download&id=17aMu562i_gv-jcy-DMCWDZxbLIDTQA0A' },
  { title: 'SAP HANA Data Management Suite',                                      url: 'https://drive.google.com/uc?export=download&id=15UDf3dWLCXt_n3o8s7RUYgLN0_hP2zY9' },
  { title: 'SAP Cloud Platform API Management',                                   url: 'https://drive.google.com/uc?export=download&id=1xZODCyAvtqrj4vxL02gjI8kBTIRCbUCz' },
  { title: 'Building Applications with SAP Cloud Application Programming Model',  url: 'https://drive.google.com/uc?export=download&id=135dyPHdxiOzQEJlnqrr_ATvPFPErgD5O' },
  { title: 'Software Development on SAP HANA (Update Q1/2019)',                   url: 'https://drive.google.com/uc?export=download&id=1dzX8RkVhL7LzDaPCr--BMLuBXiVV8uXZ' },
  { title: 'Business Process Automation in SAP S/4HANA with SAP Intelligent RPA', url: 'https://drive.google.com/uc?export=download&id=1Cilm1_hb28X3jLSf0QfFiLdcl9xfG3WQ' },
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
  { title: 'Git Started with GitHub',                                       url: 'https://www.udemy.com/certificate/UC-O22JBE5C/',                                                   provider: 'Udemy',   year: '2015', ai: false },
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
            <a key={c.code} href={c.url} target="_blank" rel="noopener noreferrer"
              className="border border-purple-100 rounded-lg p-4 bg-white hover:border-purple-300 transition-colors block">
              <p className="text-sm font-medium text-gray-900 leading-snug hover:text-purple-700">{c.title}</p>
              <p className="mt-1 text-xs text-purple-600">{c.type} · OpenSAP</p>
            </a>
          ))}
        </div>
      </section>

      {/* Records of Achievement */}
      <section id="records-of-achievement">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">Records of Achievement — OpenSAP</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {VERIFIED.map((c) => (
            c.url
              ? <a key={c.title} href={c.url} target="_blank" rel="noopener noreferrer"
                  className="border border-gray-100 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors block">
                  <p className="text-sm font-medium text-gray-900 leading-snug hover:text-blue-700">{c.title}</p>
                  <p className="mt-1 text-xs text-gray-400">Record of Achievement · OpenSAP</p>
                </a>
              : <div key={c.title} className="border border-gray-100 rounded-lg p-4 bg-white hover:border-gray-300 transition-colors">
                  <p className="text-sm font-medium text-gray-900 leading-snug">{c.title}</p>
                  <p className="mt-1 text-xs text-gray-400">Record of Achievement · OpenSAP</p>
                </div>
          ))}
        </div>
      </section>

    </main>
  )
}
