import { useState } from 'react'
import FormField from '../FormField'
import { SectionHeader, SaveBar } from '../SectionFormChrome'
import { updateSection } from '../../../lib/api'

function HeroForm({ data, onSaved, onAuthExpired }) {
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

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const updated = await updateSection('hero', form)
      setDirty(false)
      setSaved(true)
      onSaved(updated.hero)
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
      <SectionHeader eyebrow="HERO SECTION" heading="Edit hero content" dirty={dirty} />

      <FormField label="Eyebrow text" mono value={form.sectionLabel} onChange={set('sectionLabel')} />
      <FormField label="Heading" as="textarea" rows={2} serif value={form.heading} onChange={set('heading')} />
      <FormField label="Description" as="textarea" rows={4} value={form.description} onChange={set('description')} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Email" value={form.email} onChange={set('email')} />
        <FormField label="Location" value={form.location} onChange={set('location')} />
      </div>

      <SaveBar onSave={handleSave} saving={saving} saved={saved} error={error} />
    </div>
  )
}

export default HeroForm
