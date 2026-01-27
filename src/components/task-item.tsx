"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { toggleTask } from "@/actions/schedule-actions"
import { useTransition } from "react"
import { cn } from "@/lib/utils"

export function TaskItem({ task }: { task: any }) {
    const [isPending, startTransition] = useTransition()
    
    return (
        <div className="flex items-start gap-3 p-3 bg-white border rounded-lg shadow-sm">
            <Checkbox 
                checked={task.isDone} 
                onCheckedChange={() => startTransition(() => toggleTask(task.id, task.isDone))}
                disabled={isPending}
                className="mt-1"
            />
            <div className={cn("flex-1 space-y-1", task.isDone && "opacity-50 line-through")}>
                <p className="text-sm font-medium leading-none">{task.title}</p>
                <div className="flex gap-2 text-xs text-muted-foreground">
                    {task.dueDate && <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>}
                    {task.project && <span className="text-violet-600">{task.project.title}</span>}
                    <span className={cn(
                        "uppercase font-bold text-[10px]",
                        task.priority === 'high' ? "text-red-500" : 
                        task.priority === 'medium' ? "text-yellow-600" : "text-slate-500"
                    )}>{task.priority}</span>
                </div>
            </div>
        </div>
    )
}
