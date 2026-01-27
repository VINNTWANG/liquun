import { db } from "@/lib/db"
import { AddMeetingDialog } from "@/components/add-meeting-dialog"
import { AddTaskDialog } from "@/components/add-task-dialog"
import { TaskItem } from "@/components/task-item"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MessageSquare, CheckSquare } from "lucide-react"

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
    <div className="p-8 space-y-8 h-full flex flex-col">
         <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Schedule & Feedback</h2>
            <p className="text-muted-foreground">Track your tasks and record meeting outcomes.</p>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1 overflow-hidden">
            {/* Left Column: Tasks */}
            <div className="flex flex-col gap-4 h-full overflow-hidden">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center"><CheckSquare className="w-5 h-5 mr-2"/> Tasks</h3>
                    <AddTaskDialog projects={projects} />
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {tasks.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                            No tasks yet. Stay focused!
                        </div>
                    )}
                    {tasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>
            </div>

            {/* Right Column: Meetings */}
            <div className="flex flex-col gap-4 h-full overflow-hidden">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center"><MessageSquare className="w-5 h-5 mr-2"/> Meetings & Reports</h3>
                    <AddMeetingDialog projects={projects} />
                </div>
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    {meetings.length === 0 && (
                         <div className="text-center py-10 text-muted-foreground bg-slate-50 rounded-lg border border-dashed">
                            No meetings logged. Record your next feedback session here.
                        </div>
                    )}
                    {meetings.map(meeting => (
                        <Card key={meeting.id} className="border-l-4 border-l-emerald-500">
                            <CardHeader className="py-3 pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-base">{meeting.title}</CardTitle>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                                            <Calendar className="w-3 h-3"/>
                                            {new Date(meeting.date).toLocaleDateString()}
                                            {meeting.project && <span className="text-emerald-600 font-medium">• {meeting.project.title}</span>}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="py-3 pt-0 text-sm space-y-2">
                                {meeting.summary && (
                                    <div className="text-slate-600">
                                        <span className="font-semibold text-slate-900 block text-xs uppercase tracking-wider mb-1">Summary</span>
                                        {meeting.summary}
                                    </div>
                                )}
                                {meeting.feedback && (
                                    <div className="bg-emerald-50 p-2 rounded-md border border-emerald-100 text-emerald-900 mt-2">
                                        <span className="font-semibold text-emerald-700 block text-xs uppercase tracking-wider mb-1">Feedback</span>
                                        {meeting.feedback}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
         </div>
    </div>
  )
}