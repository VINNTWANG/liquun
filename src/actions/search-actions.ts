"use server"

import { db } from "@/lib/db"

export type SearchResult = {
  id: string
  title: string
  type: "project" | "experiment" | "literature"
  url: string
  meta?: string
}

export async function getGlobalSearchIndex(): Promise<SearchResult[]> {
  const projects = await db.project.findMany({
    select: { id: true, title: true, status: true }
  })
  
  const experiments = await db.experiment.findMany({
    select: { id: true, title: true, date: true, project: { select: { title: true, id: true } } }
  })
  
  const literature = await db.literature.findMany({
    select: { id: true, title: true, authors: true }
  })

  const results: SearchResult[] = [
    ...projects.map(p => ({
      id: p.id,
      title: p.title,
      type: "project" as const,
      url: `/projects/${p.id}`,
      meta: p.status
    })),
    ...experiments.map(e => ({
      id: e.id,
      title: e.title,
      type: "experiment" as const,
      url: `/projects/${e.project.id}`, // Experiments live under project context
      // actually we link to the project detail but we might want to highlight the experiment later. 
      // For now, let's link to project detail page.
      // Wait, we don't have individual experiment pages (they are in tabs).
      // Let's link to the project page.
      meta: `${e.project.title} • ${new Date(e.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}`
    })),
    ...literature.map(l => ({
      id: l.id,
      title: l.title,
      type: "literature" as const,
      url: `/literature/${l.id}`,
      meta: l.authors || "Unknown Author"
    }))
  ]

  return results
}
