import { db } from "@/lib/db"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, FileText, Calendar } from "lucide-react"

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { experiments: true, literatures: true } } }
  })

  return (
    <div className="p-8 space-y-8">
       <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Projects</h2>
            <p className="text-muted-foreground">Manage your research portfolio and tracks.</p>
          </div>
          <CreateProjectDialog />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 && (
              <div className="col-span-full text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
                  No projects found. Create your first one to get started.
              </div>
          )}
          {projects.map((project) => (
             <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full hover:border-violet-500 hover:shadow-md transition-all cursor-pointer flex flex-col group">
                    <CardHeader>
                        <div className="flex justify-between items-start gap-2">
                            <CardTitle className="leading-tight text-lg group-hover:text-violet-700 transition">{project.title}</CardTitle>
                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className={project.status === 'active' ? 'bg-violet-600' : ''}>
                                {project.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                         <p className="text-sm text-muted-foreground line-clamp-3">
                            {project.description || "No description provided."}
                         </p>
                    </CardContent>
                    <CardFooter className="text-xs text-muted-foreground border-t pt-4 flex gap-4 bg-slate-50/50 rounded-b-lg">
                         <div className="flex items-center"><FlaskConical className="w-3 h-3 mr-1"/> {project._count.experiments}</div>
                         <div className="flex items-center"><FileText className="w-3 h-3 mr-1"/> {project._count.literatures}</div>
                         <div className="flex items-center ml-auto"><Calendar className="w-3 h-3 mr-1"/> {new Date(project.updatedAt).toLocaleDateString()}</div>
                    </CardFooter>
                </Card>
             </Link>
          ))}
       </div>
    </div>
  )
}
