"use client"

import React, { useEffect, useState } from "react"
import { X, Bell, FileText, MessageSquare, UserPlus, Heart } from "lucide-react"
import { Button } from "../ui/Button"
import {
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "@/actions/notifications"
import { timeAgo } from "@/lib/utils"

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate?: () => void
}

const getNotificationMetadata = (type: string) => {
  switch (type) {
    case "post":
      return {
        icon: FileText,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      }
    case "comment":
      return {
        icon: MessageSquare,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      }
    case "user":
      return {
        icon: UserPlus,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
      }
    case "like":
      return { icon: Heart, color: "text-red-500", bgColor: "bg-red-500/10" }
    default:
      return { icon: Bell, color: "text-gray-500", bgColor: "bg-gray-500/10" }
  }
}

interface NotificationItem {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: Date
}

export function NotificationModal({
  isOpen,
  onClose,
  onUpdate,
}: NotificationModalProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadNotifications()
    }
  }, [isOpen])

  const loadNotifications = async () => {
    setLoading(true)
    const result = await getNotifications()
    if (result.success && result.data) {
      setNotifications(result.data)
    }
    setLoading(false)
  }

  const handleMarkAsRead = async (id: string, read: boolean) => {
    if (read) return
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
    await markAsRead(id)
    onUpdate?.()
  }

  const handleMarkAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    await markAllAsRead()
    onUpdate?.()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-end p-4 md:p-6 bg-black/60 backdrop-blur-sm transition-all animate-in fade-in">
      <div
        className="w-full max-w-sm bg-[#0f0f0f] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-right-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#5865F2]" />
            <h2 className="font-heading font-semibold text-white">
              Notifications
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-[#888888] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="p-12 text-center text-[#888888]">Loading...</div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-white/5">
              {notifications.map(notification => {
                const meta = getNotificationMetadata(notification.type)
                const Icon = meta.icon
                return (
                  <div
                    key={notification.id}
                    onClick={() =>
                      handleMarkAsRead(notification.id, notification.read)
                    }
                    className={`p-4 hover:bg-white/[0.02] transition-colors cursor-pointer group ${!notification.read ? "bg-[#5865F2]/5" : ""}`}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex-shrink-0 w-10 h-10 ${meta.bgColor} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}
                      >
                        <Icon className={`w-5 h-5 ${meta.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm font-semibold text-white truncate">
                            {notification.title}
                          </h3>
                          <span className="text-[10px] text-[#888888] font-mono">
                            {timeAgo(notification.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs text-[#888888] leading-relaxed line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="flex-shrink-0 w-2 h-2 bg-[#5865F2] rounded-full mt-1.5" />
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-6 h-6 text-[#444444]" />
              </div>
              <p className="text-sm text-[#888888] italic">
                No notifications yet.
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/5 bg-white/[0.01]">
          <Button
            onClick={handleMarkAllRead}
            variant="ghost"
            className="w-full text-xs font-mono text-[#888888] hover:text-[#5865F2]"
            disabled={notifications.every(n => n.read)}
          >
            MARK ALL AS READ
          </Button>
        </div>
      </div>

      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  )
}
