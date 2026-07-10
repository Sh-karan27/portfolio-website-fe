const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export async function getPortfolioContent() {
  const res = await fetch(`${API_BASE_URL}/content`)
  if (!res.ok) throw new Error(`Failed to fetch portfolio content (${res.status})`)
  const json = await res.json()
  return json.data
}
