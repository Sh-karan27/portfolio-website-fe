import { useState } from 'react'
import FormField from '../FormField'
import { SectionHeader, SaveBar } from '../SectionFormChrome'
import { updateSection } from '../../../lib/api'

// The schema stores `points` as a string[]; the editing UX uses one
// textarea with one bullet per line, joined/split at the boundary.
function toEditable(jobs) {
  return jobs.map((j) => ({ ...j, bullets: (j.points || []).join('\n') }))
}

function toPayload(jobs) {
  return jobs.map(({ bullets, ...rest }) => ({
    ...rest,
    points: bullets.split('\n').map((s) => s.trim()).filter(Boolean),
  }))
}

function ExperienceForm({ data, onSaved, onAuthExpired }) {
  const [meta, setMeta] = useState({ sectionLabel: data.sectionLabel, heading: data.heading })
  const [jobs, setJobs] = useState(() => toEditable(data.jobs))
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const setMetaField = (field) => (e) => {
    setMeta((m) => ({ ...m, [field]: e.target.value }))
    setDirty(true)
    setSaved(false)
  }

  const setJob = (index, field) => (e) => {
    setJobs((js) => js.map((j, i) => (i === index ? { ...j, [field]: e.target.value } : j)))
    setDirty(true)
    setSaved(false)
  }

  const addJob = () => {
    setJobs((js) => [...js, { role: '', period: '', bullets: '' }])
    setDirty(true)
    setSaved(false)
  }

  const removeJob = (index) => {
    setJobs((js) => js.filter((_, i) => i !== index))
    setDirty(true)
    setSaved(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const payload = { ...meta, jobs: toPayload(jobs) }
      const updated = await updateSection('experience', payload)
      setDirty(false)
      setSaved(true)
      setJobs(toEditable(updated.experience.jobs))
      onSaved(updated.experience)
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
      <SectionHeader eyebrow="EXPERIENCE" heading="Edit experience" dirty={dirty} />

      <FormField label="Section label" mono value={meta.sectionLabel} onChange={setMetaField('sectionLabel')} />
      <FormField label="Section heading" serif value={meta.heading} onChange={setMetaField('heading')} />

      {jobs.map((job, i) => (
        <div key={job._id ?? i} className="mb-4 rounded-[3px] border border-line-2 bg-card p-5">
          <div className="mb-1.5 flex items-center justify-between gap-2.5">
            <label className="text-[12.5px] font-semibold text-ink-2">Role &amp; company</label>
            <button onClick={() => removeJob(i)} className="text-[13px] text-ink-3">
              Remove
            </button>
          </div>
          <input
            value={job.role}
            onChange={setJob(i, 'role')}
            className="field-input mb-3.5 w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 font-serif text-[14.5px] font-semibold text-ink focus:border-accent focus:outline-none"
          />

          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">Dates</label>
          <input
            value={job.period}
            onChange={setJob(i, 'period')}
            className="field-input mb-3.5 w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 font-mono text-[13px] text-ink focus:border-accent focus:outline-none"
          />

          <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">Bullet points (one per line)</label>
          <textarea
            value={job.bullets}
            onChange={setJob(i, 'bullets')}
            rows={5}
            className="field-input w-full resize-y rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 text-[14px] leading-[1.6] text-ink focus:border-accent focus:outline-none"
          />
        </div>
      ))}
      <button
        onClick={addJob}
        className="mt-1.5 rounded-[2px] border border-dashed border-line-2 px-4 py-2.5 text-[13px] font-semibold text-ink-2"
      >
        + Add role
      </button>

      <SaveBar onSave={handleSave} saving={saving} saved={saved} error={error} />
    </div>
  )
}

export default ExperienceForm
