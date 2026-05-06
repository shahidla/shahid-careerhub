const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function supabaseQuery<T>(
  table: string,
  params = '',
  useServiceRole = false
): Promise<T[]> {
  const key = useServiceRole ? SERVICE_KEY : ANON_KEY
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    next: { revalidate: 3600 },
  })
  if (!res.ok) throw new Error(`Supabase error on ${table}: ${await res.text()}`)
  return res.json()
}
