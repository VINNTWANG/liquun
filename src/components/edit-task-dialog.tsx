"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateTask } from "@/actions/schedule-actions"
import { useState } from "react"
import { Pencil } from "lucide-react"
import { toLocalDateTimeInputValue } from "@/lib/datetime"

type Project = { id: string, title: string }

interface EditTaskDialogProps {
    task: {
        id: string
        title: string
        dueDate: Date | null
        priority: string
        projectId: string | null
    }
    projects: Project[]
}

export function EditTaskDialog({ task, projects }: EditTaskDialogProps) {
  const [open, setOpen] = useState(false)

  async function clientAction(formData: FormData) {
      await updateTask(task.id, formData)
      setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-teal-600 transition-colors">
            <Pencil className="h-4 w-4"/>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form action={clientAction} className="space-y-4 py-2">
            <div className="space-y-2">
                <Label htmlFor="title">Task Description</Label>
                <Input id="title" name="title" defaultValue={task.title} required />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                        id="dueDate"
                        name="dueDate"
                        type="datetime-local"
                        defaultValue={task.dueDate ? toLocalDateTimeInputValue(task.dueDate) : ""}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <select 
                        id="priority" 
                        name="priority"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        defaultValue={task.priority}
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
                    defaultValue={task.projectId || ""}
                >
                    <option value="">(None)</option>
                    {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                </select>
            </div>
            
            <DialogFooter>
                <Button type="submit">Save Changes</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
