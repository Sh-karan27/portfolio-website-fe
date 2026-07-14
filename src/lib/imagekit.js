import imageCompression from 'browser-image-compression'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'
const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY
const IMAGEKIT_UPLOAD_URL = 'https://upload.imagekit.io/api/v1/files/upload'

// Downscales oversized images and re-encodes them (in a Web Worker, off the
// main thread) before they ever leave the browser, so a multi-MB camera
// photo doesn't sit uploading for a minute. Uses a library rather than a
// hand-rolled canvas resize because it also corrects EXIF orientation —
// phone photos are often stored "sideways" with a rotation flag that a raw
// canvas draw would ignore. SVG/GIF pass through untouched (compressing a
// vector or de-animating a GIF isn't what we want here).
async function compressImage(file) {
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file
  }

  try {
    const compressed = await imageCompression(file, {
      maxWidthOrHeight: 1920,
      maxSizeMB: 2,
      initialQuality: 0.82,
      useWebWorker: true,
    })
    return compressed.size < file.size ? compressed : file
  } catch {
    return file
  }
}

// Fetches a fresh, short-lived signature from our own backend. The admin's
// session cookie authorizes this call — ImageKit's private key never
// leaves the server, so the browser only ever sees a one-time token.
async function getUploadAuth() {
  const res = await fetch(`${API_BASE_URL}/admin/imagekit-auth`, { credentials: 'include' })
  if (!res.ok) {
    const error = new Error('Failed to authorize image upload')
    error.status = res.status
    throw error
  }
  const json = await res.json()
  return json.data // { token, expire, signature }
}

// Uploads straight from the browser to ImageKit — the file bytes never
// pass through our Express server, only the resulting URL comes back.
export async function uploadImage(file, folder = '/portfolio') {
  const [{ token, expire, signature }, compressed] = await Promise.all([getUploadAuth(), compressImage(file)])

  const formData = new FormData()
  formData.append('file', compressed)
  formData.append('fileName', compressed.name)
  formData.append('publicKey', IMAGEKIT_PUBLIC_KEY)
  formData.append('signature', signature)
  formData.append('expire', expire)
  formData.append('token', token)
  formData.append('folder', folder)
  formData.append('useUniqueFileName', 'true')

  const res = await fetch(IMAGEKIT_UPLOAD_URL, { method: 'POST', body: formData })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(json?.message || `Image upload failed (${res.status})`)
  }
  return json // { url, filePath, fileId, ... }
}
