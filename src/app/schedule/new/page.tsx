import { db } from "@/lib/db"
import { MeetingForm } from "@/components/meeting-form"

export default async function NewMeetingPage({ searchParams }: { searchParams: Promise<{ projectId?: string }> }) {
  const { projectId } = await searchParams;
  const projects = await db.project.findMany({ 
      select: { id: true, title: true },
      orderBy: { updatedAt: 'desc' }
  });

  return (
    <div className="min-h-full bg-white dark:bg-slate-950">
        <MeetingForm projects={projects} defaultProjectId={projectId} />
    </div>
  )
}
