import { useState } from 'react'
import FormField from '../FormField'
import { SectionHeader, SaveBar } from '../SectionFormChrome'
import { updateSection } from '../../../lib/api'

function FooterForm({ data, onSaved, onAuthExpired }) {
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
      const updated = await updateSection('footer', form)
      setDirty(false)
      setSaved(true)
      onSaved(updated.footer)
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
      <SectionHeader eyebrow="FOOTER" heading="Edit footer" dirty={dirty} />

      <FormField label="Name" serif value={form.name} onChange={set('name')} />
      <FormField label="Copyright text" value={form.copyrightText} onChange={set('copyrightText')} />

      <SaveBar onSave={handleSave} saving={saving} saved={saved} error={error} />
    </div>
  )
}

export default FooterForm
