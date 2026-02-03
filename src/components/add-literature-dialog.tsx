"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addLiterature } from "@/actions/literature-actions"
import { useState } from "react"
import { Plus } from "lucide-react"

type Project = { id: string; title: string }

export function AddLiteratureDialog({
  projectId,
  projects
}: {
  projectId?: string
  projects?: Project[]
}) {
  const [open, setOpen] = useState(false)

  async function clientAction(formData: FormData) {
      await addLiterature(formData)
      setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"><Plus className="w-4 h-4 mr-2"/> Add Literature</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Reference</DialogTitle>
        </DialogHeader>
        <form action={clientAction} className="space-y-4 py-4">
            {projectId ? (
              <input type="hidden" name="projectId" value={projectId} />
            ) : (
              <div className="space-y-2">
                <Label htmlFor="projectId">Related Project (optional)</Label>
                <select
                  id="projectId"
                  name="projectId"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue=""
                >
                  <option value="">(None)</option>
                  {projects?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-2">
                <Label htmlFor="title">Paper Title</Label>
                <Input id="title" name="title" required placeholder="Full title of the paper" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="authors">Authors</Label>
                <Input id="authors" name="authors" placeholder="e.g. Smith, J. et al." />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input id="year" name="year" type="number" placeholder="2025" />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="url">Link / DOI</Label>
                    <Input id="url" name="url" placeholder="https://doi.org/..." />
                </div>
            </div>
            
            <DialogFooter>
                <Button type="submit">Add Reference</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
