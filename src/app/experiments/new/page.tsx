import { db } from "@/lib/db"
import { ExperimentForm } from "@/components/experiment-form"

export default async function NewExperimentPage({ searchParams }: { searchParams: Promise<{ projectId?: string }> }) {
  const { projectId } = await searchParams;
  const projects = await db.project.findMany({ 
      select: { id: true, title: true },
      orderBy: { updatedAt: 'desc' }
  });

  return <ExperimentForm projects={projects} defaultProjectId={projectId} />
}