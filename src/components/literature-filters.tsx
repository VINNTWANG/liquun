"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter, useSearchParams } from "next/navigation"

// Note: use-debounce is great but I might not have it installed. 
// I'll implement a simple timeout based debounce to avoid extra deps for now.

export function LiteratureFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const handleSearch = (term: string) => {
      const params = new URLSearchParams(searchParams)
      if (term) {
          params.set('q', term)
      } else {
          params.delete('q')
      }
      router.replace(`/literature?${params.toString()}`)
  }

  // Simple debounce wrapper
  let timeoutId: NodeJS.Timeout;
  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      clearTimeout(timeoutId);
      const val = e.target.value;
      timeoutId = setTimeout(() => handleSearch(val), 300);
  }

  const handleStatusChange = (val: string) => {
      const params = new URLSearchParams(searchParams)
      if (val && val !== 'all') {
          params.set('status', val)
      } else {
          params.delete('status')
      }
      router.replace(`/literature?${params.toString()}`)
  }

  return (
    <div className="flex gap-4 mb-6">
        <Input 
            placeholder="Search title, author..." 
            className="max-w-sm" 
            onChange={onSearchChange}
            defaultValue={searchParams.get('q')?.toString()}
        />
        <Select 
            onValueChange={handleStatusChange} 
            defaultValue={searchParams.get('status') || 'all'}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="unread">Unread</SelectItem>
                <SelectItem value="reading">Reading</SelectItem>
                <SelectItem value="read">Read</SelectItem>
            </SelectContent>
        </Select>
    </div>
  )
}
