import { useState } from 'react'
import FormField from '../FormField'
import ImageUploadField from '../ImageUploadField'
import { SectionHeader, SaveBar } from '../SectionFormChrome'
import { updateSection } from '../../../lib/api'

function AboutForm({ data, onSaved, onAuthExpired }) {
  const [form, setForm] = useState(data)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setDirty(true)
    setSaved(false)
  }

  const setPhoto = (url) => {
    setForm((f) => ({ ...f, photoUrl: url }))
    setDirty(true)
    setSaved(false)
  }

  const setStat = (index, field) => (e) => {
    setForm((f) => ({
      ...f,
      stats: f.stats.map((s, i) => (i === index ? { ...s, [field]: e.target.value } : s)),
    }))
    setDirty(true)
    setSaved(false)
  }

  const addStat = () => {
    setForm((f) => ({ ...f, stats: [...f.stats, { value: '', label: '' }] }))
    setDirty(true)
    setSaved(false)
  }

  const removeStat = (index) => {
    setForm((f) => ({ ...f, stats: f.stats.filter((_, i) => i !== index) }))
    setDirty(true)
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const updated = await updateSection('about', form)
      setDirty(false)
      setSaved(true)
      onSaved(updated.about)
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
      <SectionHeader eyebrow="ABOUT" heading="Edit about content" dirty={dirty} />

      <FormField label="Section label" mono value={form.sectionLabel} onChange={set('sectionLabel')} />
      <FormField label="Section heading" serif value={form.heading} onChange={set('heading')} />
      <FormField label="Quote" as="textarea" rows={2} value={form.quote} onChange={set('quote')} />
      <FormField label="Bio" as="textarea" rows={6} value={form.bio} onChange={set('bio')} />

      <div className="mb-4">
        <ImageUploadField
          label="Profile photo"
          value={form.photoUrl}
          onUploaded={setPhoto}
          onAuthExpired={onAuthExpired}
          folder="/portfolio/about"
        />
      </div>

      <div className="mb-2 mt-1 text-[12.5px] font-semibold text-ink-2">Stats</div>
      {form.stats.map((stat, i) => (
        <div key={stat._id ?? i} className="mb-3 grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_2fr_auto] sm:items-center">
          <input
            value={stat.value}
            onChange={setStat(i, 'value')}
            placeholder="Value"
            className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 font-mono text-[14px] text-ink focus:border-accent focus:outline-none"
          />
          <input
            value={stat.label}
            onChange={setStat(i, 'label')}
            placeholder="Label"
            className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 text-[14px] text-ink focus:border-accent focus:outline-none"
          />
          <button
            onClick={() => removeStat(i)}
            aria-label="Remove stat"
            className="h-9 w-9 flex-shrink-0 rounded-[2px] border border-line-2 text-ink-3"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addStat}
        className="mt-1.5 rounded-[2px] border border-dashed border-line-2 px-4 py-2.5 text-[13px] font-semibold text-ink-2"
      >
        + Add stat
      </button>

      <SaveBar onSave={handleSave} saving={saving} saved={saved} error={error} />
    </div>
  )
}

export default AboutForm
