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
import { createProject } from "@/actions/project-actions"
import { useState } from "react"
import { Plus } from "lucide-react"

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false)

  async function clientAction(formData: FormData) {
      await createProject(formData)
      setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-violet-600 hover:bg-violet-700"><Plus className="mr-2 h-4 w-4"/> New Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Define the scope of your new research logic.
          </DialogDescription>
        </DialogHeader>
        <form action={clientAction}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Project Title
                </Label>
                <Input id="title" name="title" placeholder="e.g. Analysis of..." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">
                  Background / Goal
                </Label>
                <Textarea id="description" name="description" placeholder="Brief description of the research goals..." rows={4}/>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Project</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
