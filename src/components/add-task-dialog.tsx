"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTask } from "@/actions/schedule-actions"
import { useState } from "react"
import { Plus } from "lucide-react"

type Project = { id: string, title: string }

export function AddTaskDialog({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false)

  async function clientAction(formData: FormData) {
      await createTask(formData)
      setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus className="mr-2 h-4 w-4"/> Add Task</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <form action={clientAction} className="space-y-4 py-2">
            <div className="space-y-2">
                <Label htmlFor="title">Task Description</Label>
                <Input id="title" name="title" required placeholder="e.g. Read paper X" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input id="dueDate" name="dueDate" type="date" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select 
                        id="priority" 
                        name="priority"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue="medium"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>
            </div>

             <div className="space-y-2">
                <Label htmlFor="projectId">Related Project</Label>
                <select 
                    id="projectId" 
                    name="projectId"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">(None)</option>
                    {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                </select>
            </div>
            
            <DialogFooter>
                <Button type="submit">Create Task</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
