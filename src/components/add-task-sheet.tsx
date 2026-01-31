"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTask } from "@/actions/schedule-actions"
import { useState } from "react"
import { Plus, Calendar, Flag, Tag, CheckSquare } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type Project = { id: string, title: string }

export function AddTaskSheet({ projects }: { projects: Project[] }) {
  const [open, setOpen] = useState(false)
  const [priority, setPriority] = useState("medium")

  async function clientAction(formData: FormData) {
      try {
          await createTask(formData)
          setOpen(false)
          toast.success("Task added to queue")
      } catch (error) {
          toast.error("Failed to add task")
      }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 hover:text-teal-600 transition-colors">
            <Plus className="mr-2 h-3.5 w-3.5"/> Add Task
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col gap-0">
        <SheetHeader className="pb-6 border-b border-slate-100 dark:border-slate-800">
          <SheetTitle className="flex items-center gap-2 text-xl font-light text-slate-900 dark:text-slate-100">
              <CheckSquare className="w-5 h-5 text-teal-600"/> New Task
          </SheetTitle>
          <SheetDescription>
            Create a new action item for your research queue.
          </SheetDescription>
        </SheetHeader>
        
        <form action={clientAction} className="flex-1 flex flex-col gap-6 py-6 overflow-y-auto">
            {/* Task Title */}
            <div className="space-y-3">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    What needs to be done?
                </Label>
                <Input 
                    id="title" 
                    name="title" 
                    required 
                    placeholder="e.g. Analyze PCR results from replicate 3" 
                    className="h-12 text-lg border-slate-200 focus:border-teal-500"
                    autoFocus
                />
            </div>
            
            {/* Priority Selection */}
            <div className="space-y-3">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                    <Flag className="w-3 h-3 mr-1.5"/> Priority Level
                </Label>
                <RadioGroup defaultValue="medium" name="priority" onValueChange={setPriority} className="grid grid-cols-3 gap-3">
                    <div>
                        <RadioGroupItem value="low" id="low" className="peer sr-only" />
                        <Label
                            htmlFor="low"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-slate-100 bg-white p-3 hover:bg-slate-50 hover:text-accent-foreground peer-data-[state=checked]:border-teal-600 peer-data-[state=checked]:text-teal-700 [&:has([data-state=checked])]:border-teal-600 cursor-pointer transition-all"
                        >
                            <span className="mb-1 text-lg font-bold text-slate-400 peer-data-[state=checked]:text-teal-600">!</span>
                            <span className="text-xs font-medium">Low</span>
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="medium" id="medium" className="peer sr-only" />
                        <Label
                            htmlFor="medium"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-slate-100 bg-white p-3 hover:bg-slate-50 hover:text-accent-foreground peer-data-[state=checked]:border-amber-500 peer-data-[state=checked]:text-amber-600 [&:has([data-state=checked])]:border-amber-500 cursor-pointer transition-all"
                        >
                            <span className="mb-1 text-lg font-bold text-amber-400 peer-data-[state=checked]:text-amber-600">!!</span>
                            <span className="text-xs font-medium">Medium</span>
                        </Label>
                    </div>
                    <div>
                        <RadioGroupItem value="high" id="high" className="peer sr-only" />
                        <Label
                            htmlFor="high"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-slate-100 bg-white p-3 hover:bg-slate-50 hover:text-accent-foreground peer-data-[state=checked]:border-red-500 peer-data-[state=checked]:text-red-600 [&:has([data-state=checked])]:border-red-500 cursor-pointer transition-all"
                        >
                            <span className="mb-1 text-lg font-bold text-red-400 peer-data-[state=checked]:text-red-600">!!!</span>
                            <span className="text-xs font-medium">High</span>
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Date & Project Row */}
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1.5"/> Due Date & Time
                    </Label>
                    <Input 
                        id="dueDate" 
                        name="dueDate" 
                        type="datetime-local" 
                        className="bg-white dark:bg-slate-900 border-slate-200"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="projectId" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                        <Tag className="w-3 h-3 mr-1.5"/> Linked Project
                    </Label>
                    <select 
                        id="projectId" 
                        name="projectId"
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white dark:bg-slate-900 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="">(No Project Link)</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            <SheetFooter className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 sm:justify-between">
                <SheetClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </SheetClose>
                <Button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white min-w-[120px]">Create Task</Button>
            </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
