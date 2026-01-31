import { db } from "@/lib/db"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { FlaskConical, FileText, Calendar, ArrowUpRight } from "lucide-react"

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    orderBy: { updatedAt: 'desc' },
    include: { _count: { select: { experiments: true, literatures: true } } }
  })

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
       <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100">Projects Index</h2>
            <p className="text-slate-500 mt-1 font-mono text-sm">Active research tracks and archived investigations.</p>
          </div>
          <CreateProjectDialog />
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 && (
              <div className="col-span-full text-center py-20 text-slate-400 border border-dashed border-slate-300 rounded-sm">
                  No projects initialized. Start a new investigation via the button above.
              </div>
          )}
          {projects.map((project) => (
             <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="h-full border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-500/50 transition-all cursor-pointer flex flex-col group rounded-sm bg-white dark:bg-slate-900/50">
                    <CardHeader>
                        <div className="flex justify-between items-start gap-2">
                            <CardTitle className="leading-tight text-lg font-semibold group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors flex items-center">
                                {project.title}
                                <ArrowUpRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400"/>
                            </CardTitle>
                            <Badge variant="outline" className={project.status === 'active' ? 'bg-teal-50 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-800' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}>
                                {project.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1">
                         <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                            {project.description || "No description provided."}
                         </p>
                    </CardContent>
                    <CardFooter className="text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-4 flex gap-4 bg-slate-50/30 dark:bg-slate-900/30 rounded-b-sm">
                         <div className="flex items-center"><FlaskConical className="w-3 h-3 mr-1.5"/> {project._count.experiments} Exp</div>
                         <div className="flex items-center"><FileText className="w-3 h-3 mr-1.5"/> {project._count.literatures} Lit</div>
                         <div className="flex items-center ml-auto font-mono"><Calendar className="w-3 h-3 mr-1.5"/> {new Date(project.updatedAt).toLocaleDateString()}</div>
                    </CardFooter>
                </Card>
             </Link>
          ))}
       </div>
    </div>
  )
}
