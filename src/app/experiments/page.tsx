import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, FolderKanban, ArrowRight } from "lucide-react"

export default async function ExperimentsPage() {
  const experiments = await db.experiment.findMany({
    orderBy: { date: 'desc' },
    include: { project: { select: { title: true, id: true } } }
  });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
        <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
                <h2 className="text-3xl font-light tracking-tight text-slate-900 dark:text-slate-100">Lab Notebook</h2>
                <p className="text-slate-500 mt-1 font-mono text-sm">Chronological record of all experimental procedures.</p>
            </div>
            <Link href="/experiments/new">
                <Button className="bg-teal-700 hover:bg-teal-800 text-white rounded-sm">
                    <Plus className="mr-2 h-4 w-4"/> Log Entry
                </Button>
            </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
             {experiments.length === 0 && (
                <div className="text-center py-20 text-slate-400 border border-dashed border-slate-300 rounded-sm">
                    No experiments found. Start logging your work.
                </div>
             )}
             {experiments.map(exp => (
                 <Card key={exp.id} className="group border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-teal-500/30 transition-all rounded-sm bg-white dark:bg-slate-900/50">
                     <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                         <div className="flex gap-4 items-start">
                             <div className="hidden md:flex flex-col items-center justify-center w-16 h-16 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-sm shrink-0">
                                 <span className="text-xs font-bold text-slate-400 uppercase">{new Date(exp.date).toLocaleString('default', { month: 'short' })}</span>
                                 <span className="text-xl font-light text-slate-700 dark:text-slate-200">{new Date(exp.date).getDate()}</span>
                             </div>
                             <div className="space-y-1">
                                 <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">
                                     {exp.title}
                                 </h3>
                                 <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                     <span className="flex items-center text-xs font-mono">
                                        <Calendar className="w-3.5 h-3.5 mr-1.5"/>
                                        {new Date(exp.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                                     </span>
                                     <span className="text-slate-300">•</span>
                                     <Link href={`/projects/${exp.project.id}`} className="hover:text-teal-600 hover:underline flex items-center transition-colors">
                                        <FolderKanban className="w-3.5 h-3.5 mr-1.5"/>
                                        {exp.project.title}
                                     </Link>
                                     <span className="text-slate-300">•</span>
                                     <Badge variant="secondary" className="rounded-sm font-normal text-xs bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-0">
                                         {exp.status}
                                     </Badge>
                                 </div>
                             </div>
                         </div>
                         <div className="flex gap-2 self-end md:self-center">
                            <Link href={`/projects/${exp.project.id}`}>
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-teal-600">
                                    View Context <ArrowRight className="w-4 h-4 ml-1"/>
                                </Button>
                            </Link>
                         </div>
                     </CardContent>
                 </Card>
             ))}
        </div>
    </div>
  )
}
