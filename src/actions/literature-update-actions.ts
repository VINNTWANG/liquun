"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function updateLiterature(id: string, formData: FormData) {
  const notes = formData.get("notes") as string
  const status = formData.get("status") as string
  const title = formData.get("title") as string
  const authors = formData.get("authors") as string
  const url = formData.get("url") as string
  const year = formData.get("year") ? parseInt(formData.get("year") as string) : undefined

  await db.literature.update({
    where: { id },
    data: {
      title,
      authors,
      url,
      year,
      status,
      notes
    }
  })

  revalidatePath(`/literature/${id}`)
  revalidatePath("/literature")
}

export async function deleteLiterature(id: string) {
    await db.literature.delete({ where: { id } })
    revalidatePath("/literature")
    redirect("/literature")
}
