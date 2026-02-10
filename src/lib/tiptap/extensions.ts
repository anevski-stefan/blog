import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Subscript from "@/lib/tiptap/marks/subscript"
import Superscript from "@/lib/tiptap/marks/superscript"

export function createTiptapExtensions(options?: {
  placeholder?: string
  readOnly?: boolean
}) {
  const placeholder = options?.placeholder ?? "Start writing..."
  const readOnly = options?.readOnly ?? false

  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3, 4, 5, 6],
      },
    }),
    Placeholder.configure({
      placeholder: readOnly ? "" : placeholder,
      emptyEditorClass: "is-editor-empty",
    }),
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: true,
    }),
    Image.configure({
      allowBase64: true,
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyle,
    Color,
    Highlight,
    Subscript,
    Superscript,
  ]
}
