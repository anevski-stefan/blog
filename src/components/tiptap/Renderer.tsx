"use client"

import * as React from "react"
import { EditorContent, type Content, useEditor } from "@tiptap/react"
import { cn, type TiptapContent } from "@/lib/utils"
import { createTiptapExtensions } from "@/components/tiptap/lib/extensions"

export function TiptapRenderer(props: {
  content?: TiptapContent
  className?: string
  editorClassName?: string
}) {
  const { content = "", className, editorClassName } = props

  const editor = useEditor({
    extensions: createTiptapExtensions({ readOnly: true, placeholder: "" }),
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none p-4",
          editorClassName
        ),
      },
    },
    editable: false,
    content: content as Content,
  })

  React.useEffect(() => {
    if (!editor || editor.isDestroyed) return
    editor.commands.setContent(content as Content)
  }, [editor, content])

  return (
    <div
      className={cn(
        "w-full rounded-md border bg-card text-card-foreground shadow-sm relative border-none shadow-none bg-transparent",
        className
      )}
    >
      <EditorContent editor={editor} />
    </div>
  )
}
