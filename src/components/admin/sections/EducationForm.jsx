import { useState } from 'react'
import FormField from '../FormField'
import { SectionHeader, SaveBar } from '../SectionFormChrome'
import { updateSection } from '../../../lib/api'

function EducationForm({ data, onSaved, onAuthExpired }) {
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
      const updated = await updateSection('education', form)
      setDirty(false)
      setSaved(true)
      onSaved(updated.education)
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
      <SectionHeader eyebrow="EDUCATION" heading="Edit education" dirty={dirty} />

      <FormField label="Section label" mono value={form.sectionLabel} onChange={set('sectionLabel')} />
      <FormField label="Degree" serif value={form.degree} onChange={set('degree')} />
      <FormField label="Institution" value={form.institution} onChange={set('institution')} />
      <FormField label="Coursework" as="textarea" rows={2} value={form.coursework} onChange={set('coursework')} />

      <div className="grid grid-cols-3 gap-3.5">
        <FormField label="Period" mono value={form.period} onChange={set('period')} />
        <FormField label="Score" value={form.score} onChange={set('score')} />
        <FormField label="Score scale" value={form.scoreScale} onChange={set('scoreScale')} />
      </div>

      <SaveBar onSave={handleSave} saving={saving} saved={saved} error={error} />
    </div>
  )
}

export default EducationForm
