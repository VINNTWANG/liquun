"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { toggleTask, deleteTask } from "@/actions/schedule-actions"
import { useTransition } from "react"
import { cn } from "@/lib/utils"
import { DeleteButton } from "@/components/delete-button"
import { EditTaskDialog } from "@/components/edit-task-dialog"

export function TaskItem({ task, projects }: { task: any, projects: any[] }) {
    const [isPending, startTransition] = useTransition()
    
    return (
        <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 border rounded-lg shadow-sm group">
            <Checkbox 
                checked={task.isDone} 
                onCheckedChange={() => startTransition(() => toggleTask(task.id, task.isDone))}
                disabled={isPending}
                className="mt-1"
            />
            <div className={cn("flex-1 space-y-1", task.isDone && "opacity-50 line-through")}>
                <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100">{task.title}</p>
                <div className="flex gap-2 text-xs text-muted-foreground">
                    {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>}
                    {task.project && <span className="text-teal-600 font-medium">{task.project.title}</span>}
                    <span className={cn(
                        "uppercase font-bold text-[10px]",
                        task.priority === 'high' ? "text-red-500" : 
                        task.priority === 'medium' ? "text-yellow-600" : "text-slate-500"
                    )}>{task.priority}</span>
                </div>
            </div>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                <EditTaskDialog task={task} projects={projects} />
                <DeleteButton 
                    onDelete={async () => deleteTask(task.id)}
                    size="sm"
                    confirmTitle="Delete Task?"
                />
            </div>
        </div>
    )
}
