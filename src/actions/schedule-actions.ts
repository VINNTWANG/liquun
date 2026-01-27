"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createMeeting(formData: FormData) {
  const title = formData.get("title") as string
  const dateStr = formData.get("date") as string
  const summary = formData.get("summary") as string
  const feedback = formData.get("feedback") as string
  const projectId = formData.get("projectId") as string

  if (!title) throw new Error("Title is required")

  await db.meeting.create({
    data: {
      title,
      date: dateStr ? new Date(dateStr) : new Date(),
      summary,
      feedback,
      projectId: projectId || null
    }
  })

  revalidatePath("/schedule")
}

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string
  const dueDateStr = formData.get("dueDate") as string
  const priority = formData.get("priority") as string
  const projectId = formData.get("projectId") as string

  if (!title) throw new Error("Title is required")

  await db.task.create({
    data: {
      title,
      dueDate: dueDateStr ? new Date(dueDateStr) : null,
      priority: priority || "medium",
      projectId: projectId || null,
      isDone: false
    }
  })

  revalidatePath("/schedule")
}

export async function toggleTask(taskId: string, currentStatus: boolean) {
    await db.task.update({
        where: { id: taskId },
        data: { isDone: !currentStatus }
    })
    revalidatePath("/schedule")
}
