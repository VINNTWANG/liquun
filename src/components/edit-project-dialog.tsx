"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { updateProject } from "@/actions/project-actions"
import { useState } from "react"
import { Pencil } from "lucide-react"

interface EditProjectDialogProps {
    project: {
        id: string
        title: string
        description: string | null
        status: string
    }
}

export function EditProjectDialog({ project }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false)

  async function clientAction(formData: FormData) {
      await updateProject(project.id, formData)
      setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-teal-600">
            <Pencil className="w-4 h-4 mr-2"/> Edit Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Update your research project details.
          </DialogDescription>
        </DialogHeader>
        <form action={clientAction}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Project Title
                </Label>
                <Input id="title" name="title" defaultValue={project.title} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">
                  Status
                </Label>
                <select 
                    id="status" 
                    name="status"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    defaultValue={project.status}
                >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">
                  Background / Goal
                </Label>
                <Textarea id="description" name="description" defaultValue={project.description || ""} rows={4}/>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
