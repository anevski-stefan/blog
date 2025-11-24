"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import Highlight from "@tiptap/extension-highlight"
import Color from "@tiptap/extension-color"
import TextStyle from "@tiptap/extension-text-style"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import { common, createLowlight } from "lowlight"
import { EditorToolbar } from "./toolbar"
import "./editor-styles.css"

interface EditorProps {
  content: string | object | null
  onChange: (content: string) => void
  placeholder?: string
}

const lowlight = createLowlight(common)

function createEditorExtensions(placeholder: string) {
  return [
    StarterKit.configure({
      codeBlock: false, // Disable default code block to use CodeBlockLowlight
    }),
    CodeBlockLowlight.configure({
      lowlight,
      defaultLanguage: "javascript",
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right", "justify"],
    }),
    Underline,
    Highlight.configure({
      multicolor: true,
    }),
    TextStyle,
    Color,
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    HorizontalRule,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: "text-primary underline decoration-primary cursor-pointer",
      },
    }),
    Image.configure({
      HTMLAttributes: {
        class: "rounded-lg max-w-full",
      },
    }),
    Placeholder.configure({ placeholder }),
  ]
}

export function Editor({
  content,
  onChange,
  placeholder = "Write something amazing...",
}: EditorProps) {
  const editor = useEditor({
    extensions: createEditorExtensions(placeholder),
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px]",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="relative min-h-[500px] w-full rounded-lg border bg-background px-3 py-2">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
