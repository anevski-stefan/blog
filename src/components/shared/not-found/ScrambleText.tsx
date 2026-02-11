"use client"

import { useEffect, useRef } from "react"

interface ScrambleItem {
  from: string
  to: string
  start: number
  end: number
  char: string
}

class TextScramble {
  el: HTMLElement
  chars: string
  queue: ScrambleItem[]
  frame: number
  frameRequest: number
  resolve: (value?: unknown) => void

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = "!<>-_\\/[]{}—=+*^?#________"
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = () => {}
    this.update = this.update.bind(this)
  }

  setText(newText: string) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise(resolve => (this.resolve = resolve))
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ""
      const to = newText[i] || ""
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end, char: "" })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ""
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      const { from, to, start, end } = this.queue[i]
      let { char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.randomChar()
          this.queue[i].char = char
        }
        output += `<span class="text-home-accent font-bold">${char}</span>`
      } else {
        output += from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      if (this.resolve) this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }

  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }

  destroy() {
    cancelAnimationFrame(this.frameRequest)
  }
}

export function ScrambleText(props: {
  className?: string
  phrases?: string[]
  initialText?: string
}) {
  const {
    className,
    initialText = "Page Not Found",
    phrases = [
      "Page Not Found",
      "Lost in Space",
      "Wrong Dimension",
      "Null Reference",
      "Path undefined",
      "Page Not Found",
    ],
  } = props

  const elRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const fx = new TextScramble(el)
    let counter = 0
    let timeoutId: number | undefined
    let cancelled = false

    const next = () => {
      if (cancelled) return
      void fx.setText(phrases[counter]).then(() => {
        if (cancelled) return
        timeoutId = window.setTimeout(next, 3000)
      })
      counter = (counter + 1) % phrases.length
    }

    timeoutId = window.setTimeout(next, 2000)

    return () => {
      cancelled = true
      if (timeoutId !== undefined) window.clearTimeout(timeoutId)
      fx.destroy()
    }
  }, [phrases])

  return (
    <span ref={elRef} className={className}>
      {initialText}
    </span>
  )
}
