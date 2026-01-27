import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { LiteratureEditor } from "@/components/literature-editor"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function LiteratureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const literature = await db.literature.findUnique({
    where: { id }
  });

  if (!literature) notFound();

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
        <Link href="/literature" className="text-muted-foreground hover:text-slate-900 flex items-center text-sm">
            <ArrowLeft className="w-4 h-4 mr-1"/> Back to Library
        </Link>
        
        <LiteratureEditor literature={literature} />
    </div>
  )
}
