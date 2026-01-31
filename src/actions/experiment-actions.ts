"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

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

  // Optional metadata
  const assayType = (formData.get("assayType") as string) || null
  const sampleType = (formData.get("sampleType") as string) || null
  const organism = (formData.get("organism") as string) || null
  const cellLine = (formData.get("cellLine") as string) || null
  const strain = (formData.get("strain") as string) || null
  const biosafetyLevel = (formData.get("biosafetyLevel") as string) || null
  const protocol = (formData.get("protocol") as string) || null
  const instrument = (formData.get("instrument") as string) || null
  const reagentLot = (formData.get("reagentLot") as string) || null

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
      tags,
      assayType,
      sampleType,
      organism,
      cellLine,
      strain,
      biosafetyLevel,
      protocol,
      instrument,
      reagentLot
    }
  })

  revalidatePath(`/projects/${projectId}`)
  revalidatePath("/experiments")
  revalidatePath("/")
}

export async function deleteExperiment(id: string, projectId: string) {

  await db.experiment.delete({

    where: { id }

  })

  

  revalidatePath(`/projects/${projectId}`)

  revalidatePath("/experiments")

  revalidatePath("/")

}



export async function updateExperiment(id: string, formData: FormData) {

  const title = formData.get("title") as string

  const content = formData.get("content") as string

  const projectId = formData.get("projectId") as string

  const status = formData.get("status") as string || "planned"

  

  // Handle Date

  const dateStr = formData.get("date") as string

  const date = dateStr ? new Date(dateStr) : new Date()



  // Handle Tags

  const tags = formData.get("tags") as string

  // Optional metadata
  const assayType = (formData.get("assayType") as string) || null
  const sampleType = (formData.get("sampleType") as string) || null
  const organism = (formData.get("organism") as string) || null
  const cellLine = (formData.get("cellLine") as string) || null
  const strain = (formData.get("strain") as string) || null
  const biosafetyLevel = (formData.get("biosafetyLevel") as string) || null
  const protocol = (formData.get("protocol") as string) || null
  const instrument = (formData.get("instrument") as string) || null
  const reagentLot = (formData.get("reagentLot") as string) || null



  if (!title || !projectId) {

    throw new Error("Title and Project are required")

  }



  await db.experiment.update({

    where: { id },

    data: {

      title,

      content,

      projectId,

      status,

      date,

      tags,
      assayType,
      sampleType,
      organism,
      cellLine,
      strain,
      biosafetyLevel,
      protocol,
      instrument,
      reagentLot

    }

  })



  revalidatePath(`/projects/${projectId}`)

  revalidatePath("/experiments")

  revalidatePath("/")

}
