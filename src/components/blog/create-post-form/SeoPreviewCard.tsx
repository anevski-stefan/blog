"use client"

function SearchPreviewIcon() {
  return (
    <svg
      className="w-4 h-4 text-[#5865F2]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  )
}

export function SeoPreviewCard(props: {
  title: string
  slug: string
  excerpt: string
}) {
  const { title, slug, excerpt } = props

  return (
    <div className="bg-[#111111]/40 border border-white/5 rounded-xl p-5 space-y-3">
      <h3 className="font-heading font-semibold flex items-center gap-2">
        <SearchPreviewIcon />
        SEO Preview
      </h3>
      <div className="bg-white rounded-lg p-3 overflow-hidden">
        <div className="text-[#1a0dab] text-sm font-medium truncate hover:underline cursor-pointer">
          {title || "Post Title"}
        </div>
        <div className="text-[#006621] text-xs flex items-center gap-1 truncate max-w-full">
          <span className="shrink-0">anevski.xyz</span>
          <span className="text-gray-400 shrink-0">›</span>
          <span className="shrink-0">blog</span>
          <span className="text-gray-400 shrink-0">›</span>
          <span className="truncate">{slug || "post-slug"}</span>
        </div>
        <div className="text-[#545454] text-xs line-clamp-2 mt-1">
          {excerpt || "Meta description will appear here..."}
        </div>
      </div>
    </div>
  )
}
