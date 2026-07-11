// Shared header + save-bar chrome reused identically by every section form.
export function SectionHeader({ eyebrow, heading, dirty }) {
  return (
    <div className="mb-7 flex items-baseline justify-between gap-4">
      <div>
        <div className="font-mono text-[11.5px] tracking-[0.04em] text-accent">{eyebrow}</div>
        <h1 className="mt-1.5 font-serif text-[26px] font-semibold tracking-tight">{heading}</h1>
      </div>
      {dirty && <div className="whitespace-nowrap font-mono text-[12px] text-ink-3">● unsaved changes</div>}
    </div>
  )
}

export function SaveBar({ onSave, saving, saved, error }) {
  return (
    <div className="mt-7">
      <div className="flex items-center gap-3.5">
        <button
          onClick={onSave}
          disabled={saving}
          className="save-btn rounded-[2px] bg-accent px-6.5 py-3 text-[14px] font-semibold text-white disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        {saved && (
          <div className="flex items-center gap-1.5 text-[13px] text-accent">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12.5l4.5 4.5L19 7" />
            </svg>
            Saved
          </div>
        )}
      </div>
      {error && <div className="mt-3 text-[13px] text-red-500">{error}</div>}
    </div>
  )
}
