"use client"

import { Settings } from "lucide-react"

export function PublishCard(props: {
  status: "draft" | "published"
  onChangeStatus: (value: "draft" | "published") => void
  publishDate: string
  onChangePublishDate: (value: string) => void
  isFeatured: boolean
  onToggleFeatured: () => void
}) {
  const {
    status,
    onChangeStatus,
    publishDate,
    onChangePublishDate,
    isFeatured,
    onToggleFeatured,
  } = props

  return (
    <div className="bg-[#111111]/40 border border-white/5 rounded-xl p-5 space-y-4">
      <h3 className="font-heading font-semibold flex items-center gap-2">
        <Settings className="w-4 h-4 text-[#5865F2]" />
        Publish
      </h3>

      <div>
        <label className="block text-xs text-[#888888] mb-2">Status</label>
        <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-lg">
          {(["draft", "published"] as const).map(s => (
            <button
              key={s}
              onClick={() => onChangeStatus(s)}
              className={`text-xs py-1.5 rounded capitalize transition-all ${status === s ? "bg-[#5865F2] text-white shadow-lg" : "text-[#888888] hover:text-white"}`}
              type="button"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#888888] mb-2">
          Publish Date
        </label>
        <div className="relative">
          <input
            type="datetime-local"
            value={publishDate}
            onChange={e => onChangePublishDate(e.target.value)}
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-2 px-3 text-xs focus:border-[#5865F2] outline-none appearance-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <span className="text-sm">Featured Post</span>
        <button
          onClick={onToggleFeatured}
          className={`w-10 h-5 rounded-full relative transition-colors ${isFeatured ? "bg-[#5865F2]" : "bg-white/10"}`}
          type="button"
        >
          <div
            className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isFeatured ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>
    </div>
  )
}
