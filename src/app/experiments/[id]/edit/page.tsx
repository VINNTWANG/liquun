import { db } from "@/lib/db"
import { ExperimentForm } from "@/components/experiment-form"
import { notFound } from "next/navigation"

export default async function EditExperimentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [experiment, projects] = await Promise.all([
      db.experiment.findUnique({ where: { id } }),
      db.project.findMany({ select: { id: true, title: true }, orderBy: { updatedAt: 'desc' } })
  ]);

  if (!experiment) {
      notFound();
  }

  return (
    <div className="min-h-full bg-white dark:bg-slate-950">
        <ExperimentForm projects={projects} initialData={experiment} />
    </div>
  )
}
