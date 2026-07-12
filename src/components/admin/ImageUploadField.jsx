import { useState } from 'react'
import { uploadImage } from '../../lib/imagekit'

// Uploads a single image straight to ImageKit and reports the resulting
// URL back to the parent form. `value` is the currently-saved URL (if any).
function ImageUploadField({ label, value, onUploaded, onAuthExpired, folder = '/portfolio' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploading(true)
    setError('')
    try {
      const result = await uploadImage(file, folder)
      onUploaded(result.url)
    } catch (err) {
      if (err.status === 401) return onAuthExpired?.()
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      {label && <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">{label}</label>}
      {value && (
        <img
          src={value}
          alt=""
          className="mb-2 h-32 w-full rounded-[2px] border border-line-2 object-cover"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={handleFile}
        disabled={uploading}
        className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 text-[13px] text-ink-2 file:mr-3 file:cursor-pointer file:rounded-[2px] file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-[12.5px] file:font-semibold file:text-white"
      />
      {uploading && <div className="mt-1.5 font-mono text-[12px] text-ink-3">Uploading…</div>}
      {error && <div className="mt-1.5 text-[12px] text-red-500">{error}</div>}
    </div>
  )
}

export default ImageUploadField
