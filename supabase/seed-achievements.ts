export {}
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function upsert(table: string, data: object[]) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': KEY, 'Authorization': `Bearer ${KEY}`, 'Prefer': 'resolution=merge-duplicates' },
    body: JSON.stringify(data)
  })
  if (!res.ok) console.error(`Error seeding ${table}:`, await res.text())
  else console.log(`${table} seeded successfully`)
}

upsert('achievements', [
  { title: 'Winner — Google TensorFlow IoT Challenge', description: 'Built a machine learning image classification application using Python and Google TensorFlow at SAP Labs.', year: '2017', sort_order: 1 },
  { title: 'Finalist — SAP What the Hack 2.0', description: 'Designed and built a click-free Real Time Speech and Predictive Analytics application for differently enabled people using SAP HANA. Granted patent US10304013B2.', year: '2016', sort_order: 2 },
  { title: 'Nominated — THE TITAN CD BLR LOB 2016 Awards', description: 'Nominated for outstanding contribution at SAP Labs Bangalore.', year: '2016', sort_order: 3 },
  { title: 'Multiple Outstanding Performance Awards — BHP Billiton project', description: 'Received multiple awards for outstanding performance on the BHP Billiton project by SAP.', year: '2012-2014', sort_order: 4 },
  { title: 'Peer-to-Peer Awards at SAP Labs', description: 'Received Peer-to-Peer recognition awards in 2012, 2013, and 2015 at SAP Labs India.', year: '2012-2015', sort_order: 5 },
  { title: 'Appreciation — Deloitte', description: 'Received an appreciation note from Deloitte for performance and technical competency during the Large Client Project implementation.', year: '2011', sort_order: 6 },
  { title: 'Active Contributor Silver — SAP Community Network', description: 'Active Contributor Silver status in SAP Community Network Forums across SAP HANA, SAP ABAP for SAP HANA, SAP ABAP, and Web Dynpro ABAP areas.', year: '', sort_order: 7 },
  { title: 'Appreciation — Enteg InfoTech', description: 'Received an appreciation note from Enteg for performance and commitment during the Suzlon Project in SAP HR (PD).', year: '2010', sort_order: 8 }
])
