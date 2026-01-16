"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { LogOut, Settings } from "lucide-react"
import { ADMIN_NAV_ITEMS as navItems } from "@/config/admin-navigation"
import { NavItem as NavItemType } from "@/types/admin"

interface SidebarProps {
  currentSection: string
  setCurrentSection: (section: string) => void
  mobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export function Sidebar({
  currentSection,
  setCurrentSection,
  mobileMenuOpen,
  setMobileMenuOpen,
}: SidebarProps) {
  return (
    <>
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#111111]/50 border-r border-white/5 transform transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-white/5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#5865F2] rounded-xl flex items-center justify-center font-heading font-bold text-lg">
                A
              </div>
              <div>
                <div className="font-heading font-semibold text-white">
                  Alex Chen
                </div>
                <div className="text-xs text-[#888888]">Blog Dashboard</div>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <SectionTitle title="Main" />
            {navItems
              .filter(i => i.group === "Main")
              .map(item => (
                <NavItem
                  key={item.id}
                  item={item as NavItemType}
                  active={currentSection === item.id}
                  onClick={() => {
                    setCurrentSection(item.id)
                    setMobileMenuOpen(false)
                  }}
                />
              ))}

            <SectionTitle title="Content" className="mt-6" />
            {navItems
              .filter(i => i.group === "Content")
              .map(item => (
                <NavItem
                  key={item.id}
                  item={item as NavItemType}
                  active={currentSection === item.id}
                  onClick={() => {
                    setCurrentSection(item.id)
                    setMobileMenuOpen(false)
                  }}
                  badgeColor={item.id === "comments" ? "amber" : "blue"}
                />
              ))}

            <SectionTitle title="System" className="mt-6" />
            <button
              onClick={() => {
                setCurrentSection("settings")
                setMobileMenuOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border-l-2 transition-all ${
                currentSection === "settings"
                  ? "bg-[#5865F2]/15 text-[#5865F2] border-[#5865F2]"
                  : "border-transparent text-[#888888] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </nav>

          <div className="p-4 border-t border-white/5">
            <div className="flex items-center gap-3 p-2">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"
                alt="Alex Chen"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate text-white">
                  Alex Chen
                </div>
                <div className="text-xs text-[#888888] truncate">
                  admin@alexchen.dev
                </div>
              </div>
              <button
                className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-[#888888]" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  )
}

function SectionTitle({
  title,
  className = "",
}: {
  title: string
  className?: string
}) {
  return (
    <div
      className={`text-xs font-mono text-[#888888] uppercase tracking-wider px-3 py-2 ${className}`}
    >
      {title}
    </div>
  )
}

function NavItem({
  item,
  active,
  onClick,
  badgeColor = "blue",
}: {
  item: NavItemType
  active: boolean
  onClick: () => void
  badgeColor?: "blue" | "amber"
}) {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border-l-2 transition-all ${
        active
          ? "bg-[#5865F2]/15 text-[#5865F2] border-[#5865F2]"
          : "border-transparent text-[#888888] hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge && (
        <span
          className={`bg-${badgeColor === "blue" ? "[#5865F2]" : "[#f59e0b]"}/20 text-${badgeColor === "blue" ? "[#5865F2]" : "[#f59e0b]"} text-xs px-2 py-0.5 rounded-full`}
        >
          {item.badge}
        </span>
      )}
    </button>
  )
}
