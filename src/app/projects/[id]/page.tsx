import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus, FlaskConical, BookOpen, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddLiteratureDialog } from "@/components/add-literature-dialog";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const project = await db.project.findUnique({
    where: { id },
    include: { 
        experiments: { orderBy: { date: 'desc' } }, 
        literatures: { orderBy: { createdAt: 'desc' } } 
    }
  });

  if (!project) notFound();

  return (
    <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-2">
             <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-violet-600 border-violet-200">Project</Badge>
                <span className="text-sm text-muted-foreground">{new Date(project.createdAt).toLocaleDateString()}</span>
             </div>
             <h1 className="text-3xl font-bold text-slate-900">{project.title}</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="experiments">Experiments ({project.experiments.length})</TabsTrigger>
                <TabsTrigger value="literature">Literature ({project.literatures.length})</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
                 <Card>
                    <CardHeader>
                        <CardTitle>Background & Context</CardTitle>
                    </CardHeader>
                    <CardContent className="prose max-w-none text-slate-600">
                        {project.description ? (
                            <div className="whitespace-pre-wrap">{project.description}</div>
                        ) : (
                            <p className="italic text-muted-foreground">No description provided.</p>
                        )}
                    </CardContent>
                 </Card>
            </TabsContent>

            {/* Experiments Tab */}
            <TabsContent value="experiments" className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Experiment Log</h3>
                    <Link href={`/experiments/new?projectId=${project.id}`}>
                        <Button size="sm"><Plus className="w-4 h-4 mr-2"/> Log Experiment</Button>
                    </Link>
                </div>
                
                {project.experiments.length === 0 ? (
                    <Card className="bg-slate-50 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <FlaskConical className="w-10 h-10 mb-4 opacity-20"/>
                            <p>No experiments recorded yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {project.experiments.map(exp => (
                            <Card key={exp.id} className="hover:border-slate-400 transition cursor-pointer">
                                <CardHeader className="py-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base">{exp.title}</CardTitle>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Calendar className="w-3 h-3"/>
                                                {new Date(exp.date).toLocaleDateString()}
                                                <Badge variant="secondary" className="text-[10px] h-5">{exp.status}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </TabsContent>

            {/* Literature Tab */}
            <TabsContent value="literature" className="space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">References</h3>
                    <AddLiteratureDialog projectId={project.id} />
                </div>
                 {project.literatures.length === 0 ? (
                    <Card className="bg-slate-50 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                            <BookOpen className="w-10 h-10 mb-4 opacity-20"/>
                            <p>No literature added yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-2">
                        {project.literatures.map(lit => (
                            <Card key={lit.id} className="hover:bg-slate-50 transition">
                                <CardContent className="p-4 flex justify-between items-start">
                                    <div>
                                        <h4 className="font-semibold">{lit.title}</h4>
                                        <p className="text-sm text-slate-500">{lit.authors} {lit.year ? `(${lit.year})` : ''}</p>
                                    </div>
                                    {lit.url && (
                                        <a href={lit.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                                            <ExternalLink className="w-4 h-4"/>
                                        </a>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </TabsContent>
        </Tabs>
    </div>
  )
}