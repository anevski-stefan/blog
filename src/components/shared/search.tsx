"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

export function Search() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("q") ?? "")
  const debouncedSearch = useDebounce(search)

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    if (debouncedSearch) {
      params.set("q", debouncedSearch)
    } else {
      params.delete("q")
    }
    params.set("page", "1") // Reset to first page on new search
    router.push(`/blog?${params.toString()}`)
  }, [debouncedSearch, router, searchParams])

  return (
    <Input
      type="search"
      placeholder="Search posts..."
      className="w-full"
      value={search}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        setSearch(e.target.value)
      }
    />
  )
}
