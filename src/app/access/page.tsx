import AccessForm from './AccessForm'

export default function AccessPage({
  searchParams,
}: {
  searchParams?: { next?: string }
}) {
  const nextPath = searchParams?.next ?? '/chat'

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-5">
        <div className="text-center">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Protected Access</p>
          <h1 className="text-2xl font-bold text-gray-900">AI Career Hub</h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter the shared access password to open protected pages and tools.
          </p>
        </div>

        <AccessForm nextPath={nextPath} />

        <p className="text-xs text-center text-gray-400">
          Contact <a href="mailto:shahid.la@gmail.com" className="hover:underline">shahid.la@gmail.com</a> if you need access.
        </p>
      </div>
    </main>
  )
}
