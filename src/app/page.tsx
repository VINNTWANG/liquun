import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, FolderKanban, BookOpen, Plus, ArrowRight, FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  // Parallel data fetching
  const [activeProjectCount, experimentCount, unreadLitCount, recentProjects] = await Promise.all([
    db.project.count({ where: { status: 'active' } }),
    db.experiment.count(),
    db.literature.count({ where: { status: 'unread' } }),
    db.project.findMany({ 
        take: 4, 
        orderBy: { updatedAt: 'desc' },
        include: { _count: { select: { experiments: true, literatures: true } } }
    })
  ]);

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back. Here is your research overview.</p>
        </div>
        <div className="flex gap-2">
           <Link href="/projects">
                <Button>
                    <Plus className="w-4 h-4 mr-2"/> 
                    New Project
                </Button>
           </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-violet-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjectCount}</div>
            <p className="text-xs text-muted-foreground">Current active research tracks</p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-pink-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experiments Logged</CardTitle>
            <FlaskConical className="h-4 w-4 text-pink-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{experimentCount}</div>
            <p className="text-xs text-muted-foreground">Total records in notebook</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Literature</CardTitle>
            <BookOpen className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadLitCount}</div>
            <p className="text-xs text-muted-foreground">Papers waiting for review</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity / Projects */}
      <div className="grid gap-4 md:grid-cols-1">
        <Card className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Projects</CardTitle>
                <Link href="/projects" className="text-sm text-blue-600 hover:underline flex items-center">
                    View All <ArrowRight className="w-3 h-3 ml-1"/>
                </Link>
            </CardHeader>
            <CardContent>
                {recentProjects.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground">
                        No projects yet. Start by creating one!
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {recentProjects.map((project) => (
                            <Link key={project.id} href={`/projects/${project.id}`}>
                                <div className="group border rounded-lg p-4 hover:border-violet-500 hover:shadow-md transition cursor-pointer h-full flex flex-col justify-between bg-white">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Badge variant={project.status === 'active' ? 'default' : 'secondary'} className={project.status === 'active' ? 'bg-violet-600' : ''}>
                                                {project.status}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">{new Date(project.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="font-semibold group-hover:text-violet-700 transition">{project.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {project.description || "No description provided."}
                                        </p>
                                    </div>
                                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground border-t pt-3">
                                        <div className="flex items-center">
                                            <FlaskConical className="w-3 h-3 mr-1"/>
                                            {project._count.experiments} Exp
                                        </div>
                                        <div className="flex items-center">
                                            <FileText className="w-3 h-3 mr-1"/>
                                            {project._count.literatures} Lit
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}