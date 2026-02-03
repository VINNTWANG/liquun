"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function addLiterature(formData: FormData) {
  const title = formData.get("title") as string
  const authors = formData.get("authors") as string
  const year = formData.get("year") ? parseInt(formData.get("year") as string) : undefined
  const url = formData.get("url") as string
  const projectIdRaw = formData.get("projectId") as string
  const projectId = projectIdRaw?.trim() ? projectIdRaw : null

  if (!title) {
      throw new Error("Title is required")
  }

  await db.literature.create({
    data: {
      title,
      authors,
      year,
      url,
      projectId,
      status: "unread"
    }
  })

  if (projectId) {
    revalidatePath(`/projects/${projectId}`)
  }
  revalidatePath("/literature")
}

export async function deleteLiteratureFromProject(id: string, projectId: string) {
  await db.literature.delete({
    where: { id }
  })
  revalidatePath(`/projects/${projectId}`)
  revalidatePath("/literature")
}
