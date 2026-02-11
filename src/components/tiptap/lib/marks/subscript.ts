import { Mark, mergeAttributes } from "@tiptap/core"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    subscript: {
      setSubscript: () => ReturnType
      toggleSubscript: () => ReturnType
      unsetSubscript: () => ReturnType
    }
  }
}

export const Subscript = Mark.create({
  name: "subscript",

  addOptions() {
    return {
      HTMLAttributes: {},
    }
  },

  parseHTML() {
    return [{ tag: "sub" }]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "sub",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ]
  },

  addCommands() {
    return {
      setSubscript:
        () =>
        ({ commands }) => {
          commands.unsetMark("superscript")
          return commands.setMark(this.name)
        },
      toggleSubscript:
        () =>
        ({ commands }) => {
          commands.unsetMark("superscript")
          return commands.toggleMark(this.name)
        },
      unsetSubscript:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name)
        },
    }
  },
})
