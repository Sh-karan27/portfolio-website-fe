import { useState } from 'react'
import FormField from '../FormField'
import { SectionHeader, SaveBar } from '../SectionFormChrome'
import { updateSection } from '../../../lib/api'

function ProjectsForm({ data, onSaved, onAuthExpired }) {
  const [meta, setMeta] = useState({ sectionLabel: data.sectionLabel, heading: data.heading })
  const [items, setItems] = useState(data.items)
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const setMetaField = (field) => (e) => {
    setMeta((m) => ({ ...m, [field]: e.target.value }))
    setDirty(true)
    setSaved(false)
  }

  const setItem = (index, field) => (e) => {
    setItems((its) => its.map((it, i) => (i === index ? { ...it, [field]: e.target.value } : it)))
    setDirty(true)
    setSaved(false)
  }

  const addItem = () => {
    setItems((its) => [...its, { number: '', title: '', description: '', stack: '', link: '' }])
    setDirty(true)
    setSaved(false)
  }

  const removeItem = (index) => {
    setItems((its) => its.filter((_, i) => i !== index))
    setDirty(true)
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = { ...meta, items }
      const updated = await updateSection('projects', payload)
      setDirty(false)
      setSaved(true)
      setItems(updated.projects.items)
      onSaved(updated.projects)
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
      <SectionHeader eyebrow="PROJECTS" heading="Edit projects" dirty={dirty} />

      <FormField label="Section label" mono value={meta.sectionLabel} onChange={setMetaField('sectionLabel')} />
      <FormField label="Section heading" serif value={meta.heading} onChange={setMetaField('heading')} />

      {items.map((item, i) => (
        <div key={item._id ?? i} className="mb-4 rounded-[3px] border border-line-2 bg-card p-5">
          <div className="mb-1.5 flex items-center justify-between gap-2.5">
            <label className="text-[12.5px] font-semibold text-ink-2">Number &amp; title</label>
            <button onClick={() => removeItem(i)} className="text-[13px] text-ink-3">
              Remove
            </button>
          </div>
          <div className="mb-3.5 grid grid-cols-[60px_1fr] gap-2.5">
            <input
              value={item.number}
              onChange={setItem(i, 'number')}
              placeholder="01"
              className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 font-mono text-[14px] text-ink focus:border-accent focus:outline-none"
            />
            <input
              value={item.title}
              onChange={setItem(i, 'title')}
              className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 font-serif text-[14.5px] font-semibold text-ink focus:border-accent focus:outline-none"
            />
          </div>

          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">Description</label>
          <textarea
            value={item.description}
            onChange={setItem(i, 'description')}
            rows={2}
            className="field-input mb-3.5 w-full resize-y rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 text-[14px] leading-[1.6] text-ink focus:border-accent focus:outline-none"
          />

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">Tech stack</label>
              <input
                value={item.stack}
                onChange={setItem(i, 'stack')}
                className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 font-mono text-[13px] text-ink focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">GitHub link</label>
              <input
                value={item.link}
                onChange={setItem(i, 'link')}
                className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 font-mono text-[13px] text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addItem}
        className="mt-1.5 rounded-[2px] border border-dashed border-line-2 px-4 py-2.5 text-[13px] font-semibold text-ink-2"
      >
        + Add project
      </button>

      <SaveBar onSave={handleSave} saving={saving} saved={saved} error={error} />
    </div>
  )
}

export default ProjectsForm
