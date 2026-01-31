"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const status = formData.get("status") as string || "active"

  if (!title) {
    throw new Error("Title is required")
  }

  await db.project.create({
    data: {
      title,
      description,
      status
    }
  })

  revalidatePath("/projects")
  revalidatePath("/")
}

export async function deleteProject(id: string) {

  await db.project.delete({

    where: { id }

  })

  

  revalidatePath("/projects")

  revalidatePath("/")

}



export async function updateProject(id: string, formData: FormData) {

  const title = formData.get("title") as string

  const description = formData.get("description") as string

  const status = formData.get("status") as string || "active"



  if (!title) {

    throw new Error("Title is required")

  }



  await db.project.update({

    where: { id },

    data: {

      title,

      description,

      status

    }

  })



  revalidatePath("/projects")

  revalidatePath(`/projects/${id}`)

  revalidatePath("/")

}
