import { useState } from 'react'
import { SectionHeader, SaveBar } from '../SectionFormChrome'
import { updateSection } from '../../../lib/api'

function SocialLinksForm({ data, onSaved, onAuthExpired }) {
  const [links, setLinks] = useState(data)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const setLink = (index, field) => (e) => {
    setLinks((ls) => ls.map((l, i) => (i === index ? { ...l, [field]: e.target.value } : l)))
    setDirty(true)
    setSaved(false)
  }

  const addLink = () => {
    setLinks((ls) => [...ls, { platform: '', url: '' }])
    setDirty(true)
    setSaved(false)
  }

  const removeLink = (index) => {
    setLinks((ls) => ls.filter((_, i) => i !== index))
    setDirty(true)
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const updated = await updateSection('social-links', links)
      setDirty(false)
      setSaved(true)
      onSaved(updated.socialLinks)
      setTimeout(() => setSaved(false), 2200)
    } catch (err) {
      if (err.status === 401) return onAuthExpired()
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <SectionHeader eyebrow="SOCIAL LINKS" heading="Edit social links" dirty={dirty} />

      {links.map((link, i) => (
        <div key={link._id ?? i} className="mb-3 grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_1.6fr_auto] sm:items-center">
          <input
            value={link.platform}
            onChange={setLink(i, 'platform')}
            placeholder="Platform"
            className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 text-[14px] text-ink focus:border-accent focus:outline-none"
          />
          <input
            value={link.url}
            onChange={setLink(i, 'url')}
            placeholder="https://"
            className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 font-mono text-[14px] text-ink focus:border-accent focus:outline-none"
          />
          <button
            onClick={() => removeLink(i)}
            aria-label="Remove link"
            className="h-9 w-9 flex-shrink-0 rounded-[2px] border border-line-2 text-ink-3"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addLink}
        className="mt-1.5 rounded-[2px] border border-dashed border-line-2 px-4 py-2.5 text-[13px] font-semibold text-ink-2"
      >
        + Add link
      </button>

      <SaveBar onSave={handleSave} saving={saving} saved={saved} error={error} />
    </div>
  )
}

export default SocialLinksForm
