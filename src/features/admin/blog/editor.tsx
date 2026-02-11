"use client"

import * as React from "react"
import {
  useEditor,
  EditorContent,
  type Editor,
  type Content,
} from "@tiptap/react"
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Type,
  X,
} from "lucide-react"
import { cn, type TiptapContent } from "@/lib/utils"
import { createTiptapExtensions } from "@/components/tiptap/lib/extensions"

interface EditorProps {
  content?: TiptapContent
  onChange?: (value: string | object) => void
  placeholder?: string
  className?: string
  editorClassName?: string
}

const ToolbarButton = ({
  isActive,
  onClick,
  children,
  ariaLabel,
}: {
  isActive?: boolean
  onClick: () => void
  children: React.ReactNode
  ariaLabel: string
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    data-state={isActive ? "on" : "off"}
    className={cn(
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
      "h-8 w-8 px-0 text-[#888888] hover:text-white hover:bg-white/10 data-[state=on]:bg-[#5865F2]/20 data-[state=on]:text-[#5865F2]"
    )}
  >
    {children}
  </button>
)

const Toolbar = ({ editor }: { editor: Editor }) => {
  if (!editor) return null

  const addLink = () => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    if (url === null) return

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = window.prompt("Image URL")
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const setTextColor = () => {
    const color = window.prompt("Color (hex or name)", "#000000")
    if (color) {
      editor.chain().focus().setColor(color).run()
    }
  }

  return (
    <div className="flex flex-wrap gap-1 border-b border-white/10 bg-transparent p-1">
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive("bold")}
        ariaLabel="Bold"
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive("italic")}
        ariaLabel="Italic"
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        isActive={editor.isActive("underline")}
        ariaLabel="Underline"
      >
        <UnderlineIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        isActive={editor.isActive("strike")}
        ariaLabel="Strikethrough"
      >
        <Strikethrough className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive("code")}
        ariaLabel="Code"
      >
        <Code className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSubscript().run()}
        isActive={editor.isActive("subscript")}
        ariaLabel="Subscript"
      >
        <SubscriptIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleSuperscript().run()}
        isActive={editor.isActive("superscript")}
        ariaLabel="Superscript"
      >
        <SuperscriptIcon className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-6 w-px bg-white/10 my-auto" />

      <ToolbarButton
        onClick={setTextColor}
        isActive={editor.isActive("textStyle")}
        ariaLabel="Text Color"
      >
        <Type className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        isActive={editor.isActive("highlight")}
        ariaLabel="Highlight"
      >
        <Highlighter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().unsetColor().run()}
        isActive={false}
        ariaLabel="Clear Color"
      >
        <X className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-6 w-px bg-white/10 my-auto" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive("heading", { level: 1 })}
        ariaLabel="Heading 1"
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive("heading", { level: 2 })}
        ariaLabel="Heading 2"
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive("heading", { level: 3 })}
        ariaLabel="Heading 3"
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-6 w-px bg-white/10 my-auto" />

      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        isActive={editor.isActive({ textAlign: "left" })}
        ariaLabel="Align Left"
      >
        <AlignLeft className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        isActive={editor.isActive({ textAlign: "center" })}
        ariaLabel="Align Center"
      >
        <AlignCenter className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        isActive={editor.isActive({ textAlign: "right" })}
        ariaLabel="Align Right"
      >
        <AlignRight className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        isActive={editor.isActive({ textAlign: "justify" })}
        ariaLabel="Justify"
      >
        <AlignJustify className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-6 w-px bg-white/10 my-auto" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive("bulletList")}
        ariaLabel="Bullet List"
      >
        <List className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive("orderedList")}
        ariaLabel="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>

      <div className="mx-1 h-6 w-px bg-white/10 my-auto" />

      <ToolbarButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        isActive={editor.isActive("blockquote")}
        ariaLabel="Blockquote"
      >
        <Quote className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        isActive={false}
        ariaLabel="Horizontal Rule"
      >
        <Minus className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={addLink}
        isActive={editor.isActive("link")}
        ariaLabel="Link"
      >
        <LinkIcon className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton onClick={addImage} isActive={false} ariaLabel="Image">
        <ImageIcon className="h-4 w-4" />
      </ToolbarButton>

      <div className="flex-1" />

      <ToolbarButton
        onClick={() => editor.chain().focus().undo().run()}
        isActive={false}
        ariaLabel="Undo"
      >
        <Undo className="h-4 w-4" />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => editor.chain().focus().redo().run()}
        isActive={false}
        ariaLabel="Redo"
      >
        <Redo className="h-4 w-4" />
      </ToolbarButton>
    </div>
  )
}

export function TiptapEditor({
  content = "",
  onChange,
  placeholder = "Start writing...",
  className,
  editorClassName,
  readOnly = false,
}: EditorProps & { readOnly?: boolean }) {
  const editor = useEditor({
    extensions: createTiptapExtensions({ placeholder, readOnly }),
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[200px] p-4",
          editorClassName
        ),
      },
    },
    editable: !readOnly,
    content: content as Content,
    onUpdate: ({ editor }) => {
      if (onChange && !readOnly) {
        onChange(editor.getJSON())
      }
    },
  })

  React.useEffect(() => {
    if (editor && content && !editor.isDestroyed) {
      if (editor.isEmpty) {
        editor.commands.setContent(content as Content)
      }
    }
  }, [editor, content])

  return (
    <div
      className={cn(
        "w-full rounded-md border bg-card text-card-foreground shadow-sm relative",
        readOnly && "border-none shadow-none bg-transparent",
        className
      )}
    >
      <style jsx global>{`
        .tiptap p.is-editor-empty:first-child::before {
          color: #6b7280;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .tiptap p.is-editor-empty:first-child::before {
          color: #9ca3af; /* text-gray-400 */
        }
      `}</style>
      {!readOnly && <Toolbar editor={editor as Editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}
