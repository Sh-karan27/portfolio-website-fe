import SocialLinks from './SocialLinks'

function Footer({ data, socialLinks }) {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[960px] flex-wrap items-center justify-between gap-3.5 px-8 py-[26px] text-[13px] text-ink-3">
        <div className="font-serif font-semibold text-ink">{data.name}</div>
        <div>{data.copyrightText}</div>
        <div className="flex gap-3.5">
          <SocialLinks links={socialLinks} />
        </div>
      </div>
    </footer>
  )
}

export default Footer
