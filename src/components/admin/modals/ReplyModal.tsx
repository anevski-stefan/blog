"use client"

import React from "react"
import { X, Send } from "lucide-react"
import { TextArea } from "../ui/Input"
import { Button } from "../ui/Button"

interface ReplyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (msg: string) => void
}

export function ReplyModal({ isOpen, onClose, onSave }: ReplyModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-[#161616] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h3 className="text-xl font-semibold text-white">Reply to Comment</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-[#888888] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          <TextArea
            label="Your Reply"
            placeholder="Type your response here..."
            rows={5}
            className="mb-6"
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              icon={Send}
              onClick={() => onSave("Reply sent successfully!")}
            >
              Send Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
