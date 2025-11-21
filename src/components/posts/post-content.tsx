"use client"

import { EditorContent, useEditor, type Content } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import { common, createLowlight } from "lowlight"
import Table from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"

const lowlight = createLowlight(common)

interface PostContentProps {
  content: Content
}

export function PostContent({ content }: PostContentProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    editable: false,
  })

  if (!editor) {
    return null
  }

  return (
    <EditorContent
      editor={editor}
      className="prose prose-stone dark:prose-invert max-w-none"
    />
  )
}
