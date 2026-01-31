"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createMeeting, updateMeeting } from "@/actions/schedule-actions"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Presentation, UserCheck, Calendar, Tag, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { toLocalDateTimeInputValue } from "@/lib/datetime"

type Project = { id: string, title: string }

type Meeting = {
    id: string
    title: string
    date: Date
    summary: string | null
    feedback: string | null
    projectId: string | null
}

interface MeetingFormProps {
    projects: Project[]
    defaultProjectId?: string
    initialData?: Meeting
}

export function MeetingForm({ projects, defaultProjectId, initialData }: MeetingFormProps) {
  const isEditing = !!initialData
  const formAction = isEditing ? updateMeeting.bind(null, initialData.id) : createMeeting

  async function handleSubmit(formData: FormData) {
      try {
          await formAction(formData)
          toast.success(isEditing ? "Meeting updated successfully" : "Meeting logged successfully", {
              description: new Date().toLocaleString()
          })
      } catch (error) {
          toast.error("Failed to save meeting", {
              description: "Please check your inputs and try again."
          })
      }
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
        {/* Breadcrumb */}
// ...
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <h1 className="text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100">
                {isEditing ? "Edit Meeting Log" : "Log Seminar / Meeting"}
            </h1>
            <p className="text-slate-500 mt-1 font-mono text-sm">
                {isEditing ? "Update existing record." : "Document presentation summaries and PI feedback for record keeping."}
            </p>
        </div>
        
        <form action={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-500">Meeting Title</Label>
                        <Input 
                            id="title" 
                            name="title" 
                            required 
                            placeholder="e.g. Monthly CRISPR Progress Report" 
                            className="text-lg font-medium rounded-sm border-slate-200 focus:border-teal-500 transition-colors"
                            defaultValue={initialData?.title}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="summary" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                            <Presentation className="w-3 h-3 mr-1.5"/> Presentation Abstract
                        </Label>
                        <Textarea 
                            id="summary" 
                            name="summary" 
                            className="min-h-[200px] rounded-sm border-slate-200 focus:border-teal-500 leading-relaxed font-mono text-sm" 
                            placeholder="- Key finding 1&#10;- Methodology overview&#10;- Data highlights"
                            defaultValue={initialData?.summary || ""}
                        />
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-sm border border-slate-200 dark:border-slate-800 h-fit">
                    <div className="space-y-2">
                        <Label htmlFor="date" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1.5"/> Date & Time
                        </Label>
                        <Input 
                            id="date" 
                            name="date" 
                            type="datetime-local" 
                            defaultValue={toLocalDateTimeInputValue(initialData?.date || new Date())} 
                            required 
                            className="rounded-sm bg-white dark:bg-slate-950"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="projectId" className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center">
                            <Tag className="w-3 h-3 mr-1.5"/> Linked Project
                        </Label>
                        <select 
                            id="projectId"
                            name="projectId" 
                            className="flex h-10 w-full rounded-md border border-slate-200 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500"
                            defaultValue={initialData?.projectId || defaultProjectId || ""}
                        >
                            <option value="">(None)</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Feedback Section - Full Width */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-teal-100 dark:border-teal-900/50 pb-2">
                    <UserCheck className="w-4 h-4 text-teal-600"/>
                    <Label htmlFor="feedback" className="text-sm font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">Supervisor Feedback & Action Items</Label>
                </div>
                <Textarea 
                    id="feedback" 
                    name="feedback" 
                    className="min-h-[250px] bg-teal-50/20 dark:bg-teal-900/5 border-teal-100 dark:border-teal-900/30 rounded-sm focus:border-teal-500 text-slate-800 dark:text-slate-100 leading-relaxed font-mono text-sm" 
                    placeholder="- [ ] Action item 1&#10;- [ ] Revise figure 3&#10;- Critical feedback point..."
                    defaultValue={initialData?.feedback || ""}
                />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
                <Link href="/schedule">
                    <Button type="button" variant="outline" className="rounded-sm">Cancel</Button>
                </Link>
                <Button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white min-w-[150px] rounded-sm">
                    {isEditing ? "Update Minutes" : "Save Minutes"}
                </Button>
            </div>
        </form>
    </div>
  )
}
