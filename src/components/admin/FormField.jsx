// Shared labeled input/textarea used by every admin section form.
function FormField({ label, as = 'input', type = 'text', value, onChange, placeholder, rows, mono, serif }) {
  const fontClass = serif ? 'font-serif' : mono ? 'font-mono' : ''
  const sharedClasses = `field-input w-full rounded-[2px] border border-line-2 bg-bg px-3 py-2.5 text-[14px] text-ink focus:border-accent focus:outline-none ${fontClass}`

  return (
    <div className="mb-5">
      {label && <label className="mb-1.5 block text-[12.5px] font-semibold text-ink-2">{label}</label>}
      {as === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 4}
          className={`${sharedClasses} resize-y leading-[1.6]`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={sharedClasses}
        />
      )}
    </div>
  )
}

export default FormField
