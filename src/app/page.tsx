export default function HomePage() {
  const callbackPath = '/api/auth/upwork/callback'
  const productionCallbackUrl = `https://upwork-5j8apg26s-shahidmsyed-projects.vercel.app${callbackPath}`

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-2">Upwork AI Job Assistant</h1>
      <p className="text-green-600 font-medium mb-10">Status: App is running</p>

      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4">Connect your Upwork account</h2>
          <a
            href="/api/auth/upwork/login"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            Connect Upwork
          </a>
        </div>

        <div className="border-t pt-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">OAuth Callback URLs</h3>
          <div>
            <p className="text-sm text-gray-500 mb-1">Local development:</p>
            <code className="block bg-gray-100 rounded px-3 py-2 text-sm break-all">
              http://localhost:3000{callbackPath}
            </code>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Production:</p>
            <code className="block bg-gray-100 rounded px-3 py-2 text-sm break-all">
              {productionCallbackUrl}
            </code>
          </div>
        </div>
      </section>
    </main>
  )
}
