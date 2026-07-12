const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'

export async function getPortfolioContent() {
  const res = await fetch(`${API_BASE_URL}/content`)
  if (!res.ok) throw new Error(`Failed to fetch portfolio content (${res.status})`)
  const json = await res.json()
  return json.data
}

export async function getProjectBySlug(slug) {
  const res = await fetch(`${API_BASE_URL}/content/projects/${slug}`)
  if (!res.ok) {
    const error = new Error(`Failed to fetch project (${res.status})`)
    error.status = res.status
    throw error
  }
  const json = await res.json()
  return json.data
}

// Throws an Error with a `status` property so callers can branch on
// status === 401 (e.g. to detect an expired admin session).
async function throwApiError(res, fallbackMessage) {
  let message = fallbackMessage
  try {
    const json = await res.json()
    if (json?.message) message = json.message
  } catch {
    // response wasn't JSON — keep the fallback message
  }
  const error = new Error(message)
  error.status = res.status
  throw error
}

export async function loginAdmin(email, password) {
  const res = await fetch(`${API_BASE_URL}/admin/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) await throwApiError(res, `Login failed (${res.status})`)
  const json = await res.json()
  return json.data.admin
}

export async function updateSection(slug, payload) {
  const res = await fetch(`${API_BASE_URL}/content/${slug}`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) await throwApiError(res, `Failed to update ${slug} (${res.status})`)
  const json = await res.json()
  return json.data
}
