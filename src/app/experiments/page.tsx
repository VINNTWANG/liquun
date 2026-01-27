import { db } from "@/lib/db"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, FolderKanban } from "lucide-react"

export default async function ExperimentsPage() {
  const experiments = await db.experiment.findMany({
    orderBy: { date: 'desc' },
    include: { project: { select: { title: true, id: true } } }
  });

  return (
    <div className="p-8 space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">All Experiments</h2>
                <p className="text-muted-foreground">A chronological log of all your research activities.</p>
            </div>
            <Link href="/experiments/new">
                <Button className="bg-pink-600 hover:bg-pink-700">
                    <Plus className="mr-2 h-4 w-4"/> Log Experiment
                </Button>
            </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
             {experiments.length === 0 && (
                <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
                    No experiments found. Start logging your work!
                </div>
             )}
             {experiments.map(exp => (
                 <Card key={exp.id} className="hover:bg-slate-50 transition">
                     <CardContent className="p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                         <div className="space-y-1">
                             <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-pink-600 border-pink-200">{exp.status}</Badge>
                                <span className="text-xs text-muted-foreground flex items-center">
                                    <Calendar className="w-3 h-3 mr-1"/>
                                    {new Date(exp.date).toLocaleDateString()}
                                </span>
                             </div>
                             <h3 className="text-lg font-semibold">{exp.title}</h3>
                             <Link href={`/projects/${exp.project.id}`} className="text-sm text-violet-600 hover:underline flex items-center">
                                <FolderKanban className="w-3 h-3 mr-1"/>
                                {exp.project.title}
                             </Link>
                         </div>
                         <div className="flex gap-2">
                            <Link href={`/projects/${exp.project.id}`}>
                                <Button variant="ghost" size="sm">View Context</Button>
                            </Link>
                         </div>
                     </CardContent>
                 </Card>
             ))}
        </div>
    </div>
  )
}
