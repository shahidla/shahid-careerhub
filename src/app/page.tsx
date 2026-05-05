export default function HomePage() {
  const callbackPath = '/api/auth/upwork/callback'
  const localCallbackUrl = `http://localhost:3000${callbackPath}`
  const productionCallbackUrl = `https://YOUR-VERCEL-DOMAIN.vercel.app${callbackPath}`

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Upwork AI Job Assistant</h1>
      <p className="text-green-600 font-medium mb-10">Status: App is running</p>

      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Upwork OAuth Callback URL</h2>

        <div>
          <p className="text-sm text-gray-500 mb-1">Local development:</p>
          <code className="block bg-gray-100 rounded px-3 py-2 text-sm break-all">
            {localCallbackUrl}
          </code>
        </div>

        <div>
          <p className="text-sm text-gray-500 mb-1">Production (after Vercel deploy):</p>
          <code className="block bg-gray-100 rounded px-3 py-2 text-sm break-all">
            {productionCallbackUrl}
          </code>
        </div>
      </section>
    </main>
  )
}
