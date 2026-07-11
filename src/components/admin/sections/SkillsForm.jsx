import { useState } from 'react'
import FormField from '../FormField'
import { SectionHeader, SaveBar } from '../SectionFormChrome'
import { updateSection } from '../../../lib/api'

function SkillsForm({ data, onSaved, onAuthExpired }) {
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

  const setGroup = (index, field) => (e) => {
    setForm((f) => ({
      ...f,
      groups: f.groups.map((g, i) => (i === index ? { ...g, [field]: e.target.value } : g)),
    }))
    setDirty(true)
    setSaved(false)
  }

  const addGroup = () => {
    setForm((f) => ({ ...f, groups: [...f.groups, { category: '', items: '' }] }))
    setDirty(true)
    setSaved(false)
  }

  const removeGroup = (index) => {
    setForm((f) => ({ ...f, groups: f.groups.filter((_, i) => i !== index) }))
    setDirty(true)
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const updated = await updateSection('skills', form)
      setDirty(false)
      setSaved(true)
      onSaved(updated.skills)
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
      <SectionHeader eyebrow="SKILLS" heading="Edit skills" dirty={dirty} />

      <FormField label="Section label" mono value={form.sectionLabel} onChange={set('sectionLabel')} />
      <FormField label="Section heading" serif value={form.heading} onChange={set('heading')} />

      {form.groups.map((group, i) => (
        <div key={group._id ?? i} className="mb-3 grid grid-cols-1 gap-2.5 sm:grid-cols-[1fr_2fr_auto] sm:items-start">
          <input
            value={group.category}
            onChange={setGroup(i, 'category')}
            placeholder="Category"
            className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 text-[13.5px] font-semibold text-ink focus:border-accent focus:outline-none"
          />
          <textarea
            value={group.items}
            onChange={setGroup(i, 'items')}
            placeholder="Comma-separated skills"
            rows={2}
            className="field-input w-full resize-y rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 text-[14px] leading-[1.5] text-ink focus:border-accent focus:outline-none"
          />
          <button
            onClick={() => removeGroup(i)}
            aria-label="Remove category"
            className="h-9 w-9 flex-shrink-0 rounded-[2px] border border-line-2 text-ink-3"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addGroup}
        className="mt-1.5 rounded-[2px] border border-dashed border-line-2 px-4 py-2.5 text-[13px] font-semibold text-ink-2"
      >
        + Add category
      </button>

      <SaveBar onSave={handleSave} saving={saving} saved={saved} error={error} />
    </div>
  )
}

export default SkillsForm
