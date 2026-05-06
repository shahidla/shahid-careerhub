const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function upsert(table: string, data: object[]) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': KEY,
      'Authorization': `Bearer ${KEY}`,
      'Prefer': 'resolution=merge-duplicates'
    },
    body: JSON.stringify(data)
  })
  if (!res.ok) {
    console.error(`Error seeding ${table}:`, await res.text())
  } else {
    console.log(`${table} seeded successfully`)
  }
}

upsert('certifications', [
  { title: 'SAP Certified Associate – Back-End Developer – ABAP Cloud', code: 'C_ABAPD_2309', issuer: 'SAP', year: '2024', credential_url: 'https://www.credly.com/badges/13d2fd08-e3bb-4d4b-aff2-2b7d15ca4e96', is_ai: false, sort_order: 1 },
  { title: 'SAP Certified Associate – SAP BTP Solution Architect', code: 'C_BTPSA_2408', issuer: 'SAP', year: '2024', credential_url: 'https://www.credly.com/badges/a0f8baaa-5b9f-4b47-af51-f6c8d5db499f', is_ai: false, sort_order: 2 },
  { title: 'Microsoft Certified: Azure AI Fundamentals', code: 'AI-900', issuer: 'Microsoft', year: '2024', credential_url: 'https://www.credly.com/badges/7cfd2e94-d0ee-49bf-a7e5-6bd58f3f62d1', is_ai: true, sort_order: 3 },
  { title: 'SAP Certified Associate – SAP S/4HANA Cloud Private Edition, ABAP Programming', code: 'C_S4HDEV_2411', issuer: 'SAP', year: '2024', credential_url: 'https://www.credly.com/badges/6ca1fc42-5024-499b-b18e-81dce3a6c52f', is_ai: false, sort_order: 4 },
  { title: 'Developing AI Applications with Python and Flask', code: '', issuer: 'IBM / Coursera', year: '2024', credential_url: 'https://www.coursera.org/account/accomplishments/verify/SDLQPRNXK4ME', is_ai: true, sort_order: 5 },
  { title: 'SAP Certified Associate – Integration Developer', code: 'C_CPI_15', issuer: 'SAP', year: '2023', credential_url: 'https://www.credly.com/badges/9c32bc2e-0fe7-4ee7-8e17-a1d1ce09d0c5', is_ai: false, sort_order: 6 },
  { title: 'SAP Certified Application Associate – SAP HANA 2.0 (SPS05)', code: 'C_HANATEC_17', issuer: 'SAP', year: '2021', credential_url: 'https://www.credly.com/badges/0c1cba7b-e9af-44b3-b03e-c04823b3a6fa', is_ai: false, sort_order: 7 },
  { title: 'SAP Certified Development Associate – ABAP with SAP NetWeaver 7.50', code: 'C_TAW12_750', issuer: 'SAP', year: '2016', credential_url: '', is_ai: false, sort_order: 8 },
  { title: 'SAP Certified Development Specialist – ABAP for SAP HANA 2.0', code: 'E_HANAAW_17', issuer: 'SAP', year: '2018', credential_url: '', is_ai: false, sort_order: 9 }
])
