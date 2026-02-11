"use client"

import React from "react"
import { Settings as SettingsIcon, TrendingUp } from "lucide-react"
import { SettingsProps } from "@/features/admin/types/admin"
import { Input, TextArea } from "../ui/Input"
import { Button } from "../ui/Button"
import { Card } from "../ui/Card"

export function Settings({
  settingsTab,
  setSettingsTab,
  showToast,
}: SettingsProps) {
  const tabs = ["general", "seo", "social", "email", "analytics", "advanced"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="!p-0 overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setSettingsTab(tab)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors border-l-2 ${settingsTab === tab ? "border-[#5865F2] bg-[#5865F2]/10 text-[#5865F2]" : "border-transparent text-[#888888]"}`}
              >
                {tab === "analytics" ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <SettingsIcon className="w-5 h-5" />
                )}
                <span className="capitalize">{tab}</span>
              </button>
            ))}
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card
            title={`${settingsTab.charAt(0).toUpperCase() + settingsTab.slice(1)} Settings`}
          >
            {settingsTab === "general" && (
              <div className="space-y-6">
                <Input label="Blog Title" defaultValue="Alex Chen's Blog" />
                <Input
                  label="Tagline"
                  defaultValue="Thoughts on software engineering and technology"
                />

                <div className="border-t border-white/10 pt-6">
                  <h4 className="font-medium mb-4 text-white">
                    Display Options
                  </h4>
                  <div className="space-y-4">
                    {[
                      {
                        label: "Show Author Info",
                        desc: "Display author details on posts",
                      },
                    ].map((option, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5"
                      >
                        <div>
                          <label className="block text-sm font-medium text-white">
                            {option.label}
                          </label>
                          <p className="text-xs text-[#888888]">
                            {option.desc}
                          </p>
                        </div>
                        <button className="w-10 h-5 bg-[#5865F2] rounded-full relative transition-colors">
                          <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-white rounded-full transition-transform" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Button variant="ghost">Reset to Defaults</Button>
                  <Button
                    onClick={() => showToast("Settings saved successfully!")}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {settingsTab === "seo" && (
              <div className="space-y-6">
                <Input
                  label="Meta Title"
                  defaultValue="Alex Chen — Software Engineer & Technical Writer"
                />
                <TextArea
                  label="Meta Description"
                  rows={3}
                  defaultValue="Deep dives into software engineering, system architecture, and building scalable applications."
                />
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Button variant="ghost">Reset to Defaults</Button>
                  <Button onClick={() => showToast("SEO settings saved!")}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {settingsTab === "social" && (
              <div className="space-y-6">
                <p className="text-sm text-[#888888]">
                  Connect your social profiles
                </p>
                {["Twitter", "GitHub", "LinkedIn", "YouTube"].map(
                  (social, i) => (
                    <Input
                      key={i}
                      label={social}
                      type="url"
                      placeholder={`https://${social.toLowerCase()}.com/...`}
                    />
                  )
                )}
                <div className="pt-4 border-t border-white/10 flex items-center justify-end">
                  <Button onClick={() => showToast("Social links saved!")}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {settingsTab === "email" && (
              <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded-lg border border-white/5 space-y-4">
                  <h4 className="text-sm font-medium text-white">
                    Newsletter Provider
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {["Mailchimp", "ConvertKit", "Substack", "Beehiiv"].map(
                      provider => (
                        <button
                          key={provider}
                          className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-white text-left transition-all"
                        >
                          {provider}
                        </button>
                      )
                    )}
                  </div>
                </div>
                <Input
                  label="API Key"
                  type="password"
                  placeholder="sk_live_..."
                />
                <Input
                  label="Audience ID"
                  placeholder="Leave empty for default"
                />
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <Button variant="ghost">Test Connection</Button>
                  <Button onClick={() => showToast("Email settings saved!")}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {settingsTab === "analytics" && (
              <div className="space-y-6">
                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                  <p className="text-sm text-[#888888] mb-4">
                    Enable tracking to see how users interact with your blog.
                  </p>
                  <Input
                    label="Google Analytics ID"
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                  <h4 className="text-sm font-medium text-white mb-4">
                    Privacy-Focused Analytics
                  </h4>
                  <Input label="Plausible Domain" placeholder="example.com" />
                  <div className="mt-4">
                    <Input label="Fathom Site ID" placeholder="ABCDEF" />
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-end">
                  <Button onClick={() => showToast("Analytics configured!")}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {settingsTab === "advanced" && (
              <div className="space-y-6">
                <TextArea
                  label="Custom Header Scripts"
                  rows={4}
                  placeholder="<script>...</script>"
                  className="font-mono text-xs"
                />
                <TextArea
                  label="Robots.txt"
                  rows={4}
                  defaultValue={`User-agent: *\nAllow: /`}
                  className="font-mono text-xs"
                />
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <h4 className="text-sm font-medium text-red-400 mb-2">
                    Danger Zone
                  </h4>
                  <p className="text-xs text-red-400/80 mb-4">
                    Permanently delete all blog data. This action cannot be
                    undone.
                  </p>
                  <Button
                    variant="ghost"
                    className="text-red-400 hover:bg-red-500/20 border-red-500/20"
                  >
                    Purge Cache & Rebuild
                  </Button>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-end">
                  <Button
                    onClick={() => showToast("Advanced settings updated!")}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
