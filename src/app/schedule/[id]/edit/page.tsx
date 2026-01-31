import { db } from "@/lib/db"
import { MeetingForm } from "@/components/meeting-form"
import { notFound } from "next/navigation"

export default async function EditMeetingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const [meeting, projects] = await Promise.all([
      db.meeting.findUnique({ where: { id } }),
      db.project.findMany({ select: { id: true, title: true }, orderBy: { updatedAt: 'desc' } })
  ]);

  if (!meeting) {
      notFound();
  }

  return (
    <div className="min-h-full bg-white dark:bg-slate-950">
        <MeetingForm projects={projects} initialData={meeting} />
    </div>
  )
}
