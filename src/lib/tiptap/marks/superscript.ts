import { Mark, mergeAttributes } from "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    superscript: {
      setSuperscript: () => ReturnType
      toggleSuperscript: () => ReturnType
      unsetSuperscript: () => ReturnType
    }
  }
}

export const Superscript = Mark.create({
  name: "superscript",

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: "sup" }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "sup",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ]
  },

  addCommands() {
    return {
      setSuperscript:
        () =>
        ({ commands }) => {
          commands.unsetMark("subscript")
          return commands.setMark(this.name)
        },
      toggleSuperscript:
        () =>
        ({ commands }) => {
          commands.unsetMark("subscript")
          return commands.toggleMark(this.name)
        },
      unsetSuperscript:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
    }
  },
})
