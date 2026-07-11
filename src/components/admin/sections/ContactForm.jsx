import { useState } from 'react'
import FormField from '../FormField'
import { SectionHeader, SaveBar } from '../SectionFormChrome'
import { updateSection } from '../../../lib/api'

function ContactForm({ data, onSaved, onAuthExpired }) {
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
      const updated = await updateSection('contact', form)
      setDirty(false)
      setSaved(true)
      onSaved(updated.contact)
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
      <SectionHeader eyebrow="CONTACT" heading="Edit contact section" dirty={dirty} />

      <FormField label="Section label" mono value={form.sectionLabel} onChange={set('sectionLabel')} />
      <FormField label="Heading" serif value={form.heading} onChange={set('heading')} />
      <FormField label="Description" as="textarea" rows={3} value={form.description} onChange={set('description')} />

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <FormField label="Email" value={form.email} onChange={set('email')} />
        <FormField label="Phone" value={form.phone} onChange={set('phone')} />
      </div>
      <FormField label="Location" value={form.location} onChange={set('location')} />

      <SaveBar onSave={handleSave} saving={saving} saved={saved} error={error} />
    </div>
  )
}

export default ContactForm
