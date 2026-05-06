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

upsert('blogs', [
  { title: 'Event Driven SAP CAP on Kyma with Agentic AI and UI Auto Refresh', url: 'https://community.sap.com/t5/technology-blogs-by-members/event-driven-sap-cap-on-kyma-with-agentic-ai-and-ui-auto-refresh/ba-p/13882244', tags: ['CAP', 'Kyma', 'AI', 'Event-driven'], is_ai: true, sort_order: 1 },
  { title: 'Event Driven Integration Using SAP Integration Suite, Solace, HANA DB, and OpenAI Validation', url: 'https://community.sap.com/t5/technology-blogs-by-members/event-driven-integration-using-sap-integration-suite-solace-hana-db-and/ba-p/13725452', tags: ['Integration Suite', 'OpenAI', 'Event-driven', 'AI'], is_ai: true, sort_order: 2 },
  { title: 'Automated Job Screening Using SAP Integration Suite, Adzuna, and ChatGPT', url: 'https://community.sap.com/t5/technology-blogs-by-members/automated-job-screening-using-sap-integration-suite-adzuna-and-chatgpt/ba-p/13648199', tags: ['Integration Suite', 'ChatGPT', 'AI', 'Automation'], is_ai: true, sort_order: 3 },
  { title: 'Multi-Service PAYG Application: SAP BTP Kyma Runtime, Docker, Ethereum, SAP AI Business Services', url: 'https://community.sap.com/t5/technology-blogs-by-members/multi-service-payg-application-sap-btp-kyma-runtime-docker-ethereum-sap-ai/ba-p/13548125', tags: ['BTP', 'Kyma', 'AI Business Services', 'Docker'], is_ai: true, sort_order: 4 },
  { title: 'SAP Intelligent Robotic Process Automation & SAP Conversational AI & SAP CAP - 4 Part Series', url: 'https://community.sap.com/t5/technology-blogs-by-members/sap-intelligent-robotic-process-automation-amp-sap-conversational-ai-amp-sap/ba-p/13455166', tags: ['IRPA', 'Conversational AI', 'CAP', 'AI'], is_ai: true, sort_order: 5 },
  { title: 'SAP Cloud Platform Enterprise Messaging (SAP Event Mesh) with Twitter', url: 'https://community.sap.com/t5/technology-blogs-by-members/sap-cloud-platform-enterprise-messaging-sap-event-mesh-with-twitter/ba-p/13385793', tags: ['Event Mesh', 'Integration', 'BTP'], is_ai: false, sort_order: 6 },
  { title: 'SAP S/4HANA & WhatsApp & Machine learning & MQTT Messaging', url: 'https://community.sap.com/t5/technology-blogs-by-members/sap-s-4hana-amp-whatsapp-amp-machine-learning-amp-mqtt-messaging/ba-p/13322050', tags: ['S/4HANA', 'Machine Learning', 'AI', 'Messaging'], is_ai: true, sort_order: 7 }
])
