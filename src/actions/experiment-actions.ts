"use server"

import { db } from "@/lib/db"
import { redirect } from "next/navigation"

export async function createExperiment(formData: FormData) {
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const projectId = formData.get("projectId") as string
  const status = formData.get("status") as string || "planned"
  
  // Handle Date
  const dateStr = formData.get("date") as string
  const date = dateStr ? new Date(dateStr) : new Date()

  // Handle Tags
  const tags = formData.get("tags") as string

  if (!title || !projectId) {
    throw new Error("Title and Project are required")
  }

  await db.experiment.create({
    data: {
      title,
      content,
      projectId,
      status,
      date,
      tags
    }
  })

  redirect(`/projects/${projectId}`)
}
