"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createMeeting } from "@/actions/schedule-actions"
import { useState } from "react"
import { Plus } from "lucide-react"
import { toLocalDateTimeInputValue } from "@/lib/datetime"

type Project = { id: string, title: string }

export function AddMeetingDialog({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false)

  async function clientAction(formData: FormData) {
      await createMeeting(formData)
      setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700"><Plus className="mr-2 h-4 w-4"/> Log Meeting</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Log Meeting / Report</DialogTitle>
        </DialogHeader>
        <form action={clientAction} className="space-y-4 py-2">
            <div className="space-y-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input id="title" name="title" required placeholder="e.g. Weekly Lab Meeting" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="date">Date & Time</Label>
                    <Input id="date" name="date" type="datetime-local" required defaultValue={toLocalDateTimeInputValue(new Date())}/>
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
            </div>

            <div className="space-y-2">
                <Label htmlFor="summary">Summary of Presentation</Label>
                <Textarea id="summary" name="summary" placeholder="What did you present?" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="feedback" className="text-emerald-600 font-semibold">Feedback / Action Items</Label>
                <Textarea id="feedback" name="feedback" placeholder="What feedback did you receive?" className="bg-emerald-50 border-emerald-200" />
            </div>
            
            <DialogFooter>
                <Button type="submit">Save Record</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
