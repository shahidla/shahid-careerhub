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

upsert('skills', [
  { category: 'Core SAP Engineering', items: ['ABAP on HANA (CDS, AMDP, RAP)', 'ABAP OO, RICEF, Web Dynpro ABAP', 'SAP HANA Platform Native Developments', 'SAP Fiori (CDS, Annotations)', 'ABAP HR and ERP module extensions'], is_ai: false, sort_order: 1 },
  { category: 'SAP BTP', items: ['SAP BTP CAP (project experience)', 'SAP BTP Integration Suite (exposure and prototyping)', 'Event-driven patterns, Event Mesh, Kyma runtime (proof-of-concept)', 'Open Connectors, SAP IRPA, SAP AI Business Services, Conversational AI'], is_ai: false, sort_order: 2 },
  { category: 'Architecture and Performance', items: ['High-volume data processing and performance optimisation', 'Clean core and S/4HANA transformation, including custom code remediation and cloud readiness', 'Code pushdown, SQL optimisation, and system modernisation', 'SCMON, SUSG, ATC, SAP Readiness Check, Quick Fix', 'Tier 1, Tier 2, and Tier 3 extensibility models'], is_ai: false, sort_order: 3 },
  { category: 'AI and Exploration', items: ['Machine learning and AI-based workflows (proof-of-concept)', 'SAP HANA PAL and R-based modelling', 'AI-assisted automation patterns', 'Node.js MCP server for SAP RAP OData execution', 'RAG, embeddings, vector search, LLM integration'], is_ai: true, sort_order: 4 },
  { category: 'Programming and Tools', items: ['Languages: Node.js, Python, R', 'Frontend: JavaScript, HTML5, SAP UI5', 'Databases: SAP HANA, MongoDB, Neo4J', 'Tools: SAP BAS, Eclipse, Visual Studio Code, Git'], is_ai: false, sort_order: 5 }
])
