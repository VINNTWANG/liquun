import { db } from "@/lib/db"
import { AddMeetingDialog } from "@/components/add-meeting-dialog"
import { AddTaskSheet } from "@/components/add-task-sheet"
import { Button } from "@/components/ui/button"
import { TaskItem } from "@/components/task-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageSquare, CheckSquare, Presentation, UserCheck, Tag, Plus, ClipboardList, Pencil } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MarkdownPreview } from "@/components/markdown-preview"
import { DeleteButton } from "@/components/delete-button"
import { deleteMeeting } from "@/actions/schedule-actions"

export default async function SchedulePage() {
  const projects = await db.project.findMany({ select: { id: true, title: true } })
  
  const meetings = await db.meeting.findMany({
      orderBy: { date: 'desc' },
      include: { project: true }
  })

  const tasks = await db.task.findMany({
      orderBy: [ { isDone: 'asc' }, { dueDate: 'asc' } ],
      include: { project: true }
  })

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8 h-full flex flex-col bg-slate-50 dark:bg-slate-950">
         <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex justify-between items-end">
            <div>
                <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100">Schedule & Feedback</h2>
                <p className="text-slate-500 mt-1 font-mono text-sm">Task priority queue and seminar feedback logs.</p>
            </div>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
            {/* Left Column: Tasks (Narrower: 3 cols) */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-full overflow-hidden">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center text-slate-800 dark:text-slate-200"><CheckSquare className="w-4 h-4 mr-2 text-teal-600"/> Tasks</h3>
                    <AddTaskSheet projects={projects} />
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                    {tasks.length === 0 && (
                        <div className="text-center py-10 text-slate-400 bg-white dark:bg-slate-900/50 rounded-sm border border-dashed border-slate-300 dark:border-slate-800">
                            No active tasks.
                        </div>
                    )}
                    {tasks.map(task => (
                        <TaskItem key={task.id} task={task} projects={projects} />
                    ))}
                </div>
            </div>

            {/* Right Column: Meetings (Wider: 9 cols) */}
            <div className="lg:col-span-9 flex flex-col gap-4 h-full overflow-hidden">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center text-slate-800 dark:text-slate-200"><MessageSquare className="w-4 h-4 mr-2 text-teal-600"/> Meeting Minutes</h3>
                    <Link href="/schedule/new">
                        <Button className="bg-teal-700 hover:bg-teal-800 text-white rounded-sm"><Plus className="mr-2 h-4 w-4"/> Log Minutes</Button>
                    </Link>
                </div>
                
                <div className="flex-1 overflow-y-auto pr-4 space-y-8 relative pb-20">
                    {/* Timeline Line */}
                    {meetings.length > 0 && (
                         <div className="absolute left-[19px] top-4 bottom-0 w-px bg-slate-200 dark:bg-slate-800 -z-10"></div>
                    )}

                    {meetings.length === 0 && (
                         <div className="text-center py-20 text-slate-400 bg-slate-50 dark:bg-slate-900/50 rounded-sm border border-dashed border-slate-300 dark:border-slate-800">
                            No meeting records found. Log your feedback sessions here.
                        </div>
                    )}

                    {meetings.map(meeting => (
                        <div key={meeting.id} className="flex gap-6 items-start">
                            {/* Date Bubble */}
                            <div className="flex flex-col items-center shrink-0 sticky top-0">
                                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border-2 border-teal-600 flex items-center justify-center z-10 shadow-sm">
                                     <span className="text-xs font-bold text-teal-700 dark:text-teal-400 leading-none">
                                        {new Date(meeting.date).getDate()}
                                     </span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase">
                                    {new Date(meeting.date).toLocaleString('default', { month: 'short' })}
                                </span>
                            </div>

                            {/* Content Card */}
                            <Card className="flex-1 border border-slate-200 dark:border-slate-800 shadow-sm rounded-sm bg-white dark:bg-slate-900/80 hover:border-teal-500/30 transition-colors overflow-hidden">
                                <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">{meeting.title}</CardTitle>
                                                {meeting.project && (
                                                    <Badge variant="secondary" className="bg-white border border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 font-normal text-[10px] rounded-sm">
                                                        <Tag className="w-3 h-3 mr-1 opacity-50"/> {meeting.project.title}
                                                    </Badge>
                                                )}
                                            </div>
                                            <div className="text-xs text-slate-400 font-mono">
                                                ID: {meeting.id.slice(0, 8)} • {new Date(meeting.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Link href={`/schedule/${meeting.id}/edit`}>
                                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-teal-600 transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <DeleteButton 
                                              onDelete={async () => {
                                                "use server"
                                                await deleteMeeting(meeting.id)
                                              }}
                                              confirmTitle="Delete Meeting Record?"
                                              confirmDescription="This will permanently remove this meeting entry and its associated feedback."
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                                        
                                        {/* Presentation Abstract Section */}
                                        <div className="p-6 space-y-3">
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center mb-4">
                                                <Presentation className="w-4 h-4 mr-2 text-slate-400"/> Presentation Abstract
                                            </h4>
                                            <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed min-h-[100px]">
                                                {meeting.summary ? (
                                                    <MarkdownPreview content={meeting.summary} />
                                                ) : (
                                                    <span className="italic text-slate-400">No summary recorded.</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Supervisor Feedback Section - "Action Sheet" Style */}
                                        <div className="p-6 bg-teal-50/30 dark:bg-teal-900/10 min-h-[250px] relative">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-teal-500/20"></div>
                                            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 flex items-center mb-4">
                                                <ClipboardList className="w-4 h-4 mr-2"/> Action Items & Feedback
                                            </h4>
                                            
                                            <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                                                {meeting.feedback ? (
                                                    <div className="prose-sm prose-ul:list-disc prose-ul:pl-4 prose-li:marker:text-teal-500">
                                                        <MarkdownPreview content={meeting.feedback} />
                                                    </div>
                                                ) : (
                                                    <span className="italic text-slate-400">No specific feedback recorded.</span>
                                                )}
                                            </div>

                                            {/* Watermark/Decoration */}
                                            <div className="absolute bottom-4 right-4 opacity-5">
                                                <UserCheck className="w-16 h-16 text-teal-900"/>
                                            </div>
                                        </div>

                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
         </div>
    </div>
  )
}
