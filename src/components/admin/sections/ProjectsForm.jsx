import { useState } from 'react'
import FormField from '../FormField'
import ImageUploadField from '../ImageUploadField'
import { SectionHeader, SaveBar } from '../SectionFormChrome'
import { updateSection } from '../../../lib/api'

// Pill toggle used for "Show before/after comparison".
function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      aria-label="Toggle before/after comparison"
      className="h-[26px] w-[44px] flex-shrink-0 rounded-full p-[3px] transition-colors"
      style={{ background: checked ? 'var(--accent)' : 'var(--line2)' }}
    >
      <div
        className="h-5 w-5 rounded-full bg-white transition-transform"
        style={{ transform: checked ? 'translateX(18px)' : 'translateX(0)' }}
      />
    </button>
  )
}

// A stacked list of image uploads for one before/after column, each with
// its own remove button and a trailing "+ Add image" slot.
function ImageList({ label, accent, images, onChange, onAuthExpired }) {
  const updateAt = (idx, url) => onChange(images.map((u, i) => (i === idx ? url : u)))
  const removeAt = (idx) => onChange(images.filter((_, i) => i !== idx))
  const addSlot = () => onChange([...images, ''])

  return (
    <div>
      <div
        className="mb-2.5 font-mono text-[11px] uppercase tracking-[0.06em]"
        style={{ color: accent ? 'var(--accent)' : 'var(--ink3)' }}
      >
        {label}
      </div>
      {images.map((url, idx) => (
        <div key={idx} className="mb-2.5 flex items-start gap-2">
          <div className="min-w-0 flex-1">
            <ImageUploadField
              value={url}
              onUploaded={(uploadedUrl) => updateAt(idx, uploadedUrl)}
              onAuthExpired={onAuthExpired}
              folder="/portfolio/projects"
            />
          </div>
          <button
            onClick={() => removeAt(idx)}
            aria-label="Remove image"
            className="h-[34px] w-[34px] flex-shrink-0 rounded-[2px] border border-line-2 text-ink-3"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addSlot}
        className="w-full rounded-[2px] border border-dashed border-line-2 px-3 py-2.5 text-[12.5px] font-semibold text-ink-2"
      >
        + Add image
      </button>
    </div>
  )
}

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

  const setItemValue = (index, field, value) => {
    setItems((its) => its.map((it, i) => (i === index ? { ...it, [field]: value } : it)))
    setDirty(true)
    setSaved(false)
  }

  const setItem = (index, field) => (e) => setItemValue(index, field, e.target.value)

  const addItem = () => {
    setItems((its) => [
      ...its,
      {
        number: '',
        title: '',
        description: '',
        stack: '',
        tag: '',
        coverImage: '',
        githubUrl: '',
        liveUrl: '',
        hasBeforeAfter: false,
        beforeImages: [],
        afterImages: [],
      },
    ])
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

          <div className="mb-3.5">
            <ImageUploadField
              label="Cover image"
              value={item.coverImage}
              onUploaded={(url) => setItemValue(i, 'coverImage', url)}
              onAuthExpired={onAuthExpired}
              folder="/portfolio/projects"
            />
          </div>

          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">Description</label>
          <textarea
            value={item.description}
            onChange={setItem(i, 'description')}
            rows={2}
            className="field-input mb-3.5 w-full resize-y rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 text-[14px] leading-[1.6] text-ink focus:border-accent focus:outline-none"
          />

          <div className="mb-3.5 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">Tech stack</label>
              <input
                value={item.stack}
                onChange={setItem(i, 'stack')}
                className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 font-mono text-[13px] text-ink focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">Tag</label>
              <input
                value={item.tag || ''}
                onChange={setItem(i, 'tag')}
                placeholder="e.g. React"
                className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 font-mono text-[13px] text-ink focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">GitHub URL</label>
              <input
                value={item.githubUrl}
                onChange={setItem(i, 'githubUrl')}
                className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 font-mono text-[13px] text-ink focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">Live URL</label>
              <input
                value={item.liveUrl}
                onChange={setItem(i, 'liveUrl')}
                placeholder="https://..."
                className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 font-mono text-[13px] text-ink focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">URL slug</label>
              <input
                value={item.slug || ''}
                onChange={setItem(i, 'slug')}
                placeholder="auto-generated from title if left blank"
                className="field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 font-mono text-[13px] text-ink focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-1 flex items-center justify-between gap-3.5 border-t border-line pt-3.5">
            <div>
              <div className="text-[14px] font-semibold text-ink">Show Before / After comparison</div>
              <div className="mt-0.5 text-[12.5px] text-ink-3">
                Toggle on for redesign projects with before/after screenshots.
              </div>
            </div>
            <ToggleSwitch
              checked={!!item.hasBeforeAfter}
              onChange={() => setItemValue(i, 'hasBeforeAfter', !item.hasBeforeAfter)}
            />
          </div>

          {item.hasBeforeAfter && (
            <div className="mt-4.5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <ImageList
                label="Before images"
                images={item.beforeImages || []}
                onChange={(images) => setItemValue(i, 'beforeImages', images)}
                onAuthExpired={onAuthExpired}
              />
              <ImageList
                label="After images"
                accent
                images={item.afterImages || []}
                onChange={(images) => setItemValue(i, 'afterImages', images)}
                onAuthExpired={onAuthExpired}
              />
            </div>
          )}
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
