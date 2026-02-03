import { db } from "@/lib/db"
import { LiteratureFilters } from "@/components/literature-filters"
import { AddLiteratureDialog } from "@/components/add-literature-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import { ExternalLink, BookOpen, CheckCircle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function LiteraturePage({ searchParams }: { searchParams: Promise<{ q?: string, status?: string }> }) {
  const { q, status } = await searchParams;

  const projects = await db.project.findMany({
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" }
  })

  // Build filter object
  const where: any = {}
  
  if (status && status !== 'all') {
      where.status = status
  }

  if (q) {
      where.OR = [
          { title: { contains: q } }, // SQLite contains is case-sensitive usually? Prisma handles it? 
          // Prisma + SQLite: contains is usually case-insensitive in newer versions or depends on collation.
          // Let's assume basic match for now.
          { authors: { contains: q } }
      ]
  }

  const literature = await db.literature.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: { project: true }
  })

  // Helper for Status Badge
  const getStatusBadge = (s: string) => {
      switch(s) {
          case 'read': return <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1"/> Read</Badge>;
          case 'reading': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1"/> Reading</Badge>;
          default: return <Badge variant="outline"><BookOpen className="w-3 h-3 mr-1"/> Unread</Badge>;
      }
  }

  return (
    <div className="p-8 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Literature Library</h2>
                <p className="text-muted-foreground">Search, filter, and manage your reading list.</p>
            </div>
            <AddLiteratureDialog projects={projects} />
        </div>

        <LiteratureFilters />

        <div className="rounded-md border bg-white shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[40%]">Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Authors</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {literature.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          {q || status ? "No matches found." : "No literature added yet."}
                      </TableCell>
                  </TableRow>
              )}
              {literature.map((lit) => (
                <TableRow key={lit.id} className="group hover:bg-slate-50 transition-colors">
                  <TableCell className="font-medium">
                      <Link href={`/literature/${lit.id}`} className="block w-full h-full hover:text-violet-700 transition font-semibold text-base py-2">
                        {lit.title}
                      </Link>
                  </TableCell>
                  <TableCell>
                      {getStatusBadge(lit.status)}
                  </TableCell>
                  <TableCell className="text-slate-600 max-w-[200px] truncate">{lit.authors}</TableCell>
                  <TableCell>{lit.year}</TableCell>
                  <TableCell>
                      {lit.project ? (
                          <Link href={`/projects/${lit.project.id}`} className="text-xs font-medium px-2 py-1 rounded bg-slate-100 text-slate-600 hover:bg-slate-200">
                            {lit.project.title}
                          </Link>
                      ) : <span className="text-slate-300">-</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    {lit.url && <a href={lit.url} target="_blank" rel="noreferrer" className="inline-block text-slate-400 hover:text-blue-600 p-2"><ExternalLink className="w-4 h-4"/></a>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
    </div>
  )
}
