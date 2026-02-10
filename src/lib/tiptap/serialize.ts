import { Editor as CoreEditor } from "@tiptap/core"
import { createTiptapExtensions } from "@/lib/tiptap/extensions"

export function serializeEditorContent(value: string | object): string {
  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value)
  }

  const raw = String(value ?? "").trim()
  if (!raw) return ""

  try {
    const parsed = JSON.parse(raw) as unknown
    if (parsed && typeof parsed === "object") {
      return raw
    }
  } catch {}

  const editor = new CoreEditor({
    extensions: createTiptapExtensions({ readOnly: true, placeholder: "" }),
    editable: false,
    content: raw,
  })

  const json = editor.getJSON()
  editor.destroy()

  return JSON.stringify(json)
}
