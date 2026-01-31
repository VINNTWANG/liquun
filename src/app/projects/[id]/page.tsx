import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus, FlaskConical, BookOpen, Calendar, ExternalLink, ArrowLeft, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AddLiteratureDialog } from "@/components/add-literature-dialog";
import { DeleteButton } from "@/components/delete-button";
import { deleteProject } from "@/actions/project-actions";
import { deleteExperiment } from "@/actions/experiment-actions";
import { deleteLiteratureFromProject } from "@/actions/literature-actions";
import { EditProjectDialog } from "@/components/edit-project-dialog";

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
    <div className="p-8 max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="space-y-6">
             <div className="flex items-center justify-between">
                <Link href="/projects" className="text-sm text-slate-500 hover:text-teal-600 flex items-center transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1"/> Back to Index
                </Link>
                <div className="flex items-center gap-2">
                    <EditProjectDialog project={project} />
                    <DeleteButton 
                        onDelete={async () => {
                            "use server"
                            await deleteProject(project.id)
                        }}
                        confirmTitle="Delete Entire Project?"
                        confirmDescription="This will permanently delete this project and all its associated data (experiments will be deleted, literature and meetings will be unlinked). This action is irreversible."
                        size="sm"
                        className="text-slate-400 hover:text-red-600"
                    />
                </div>
             </div>
             <div className="border-l-4 border-teal-600 pl-6 py-1">
                 <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="text-teal-700 border-teal-200 bg-teal-50 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800 rounded-sm font-normal uppercase tracking-wider text-[10px]">
                        Project {project.status}
                    </Badge>
                    <span className="text-xs font-mono text-slate-400">ID: {project.id.slice(0,8)}</span>
                 </div>
                 <h1 className="text-4xl font-light text-slate-900 dark:text-slate-100 tracking-tight leading-tight">{project.title}</h1>
             </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-8">
            <TabsList className="bg-transparent border-b border-slate-200 dark:border-slate-800 w-full justify-start h-auto p-0 rounded-none">
                <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:text-teal-700 data-[state=active]:shadow-none px-6 py-3 text-slate-500 font-medium">Overview</TabsTrigger>
                <TabsTrigger value="experiments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:text-teal-700 data-[state=active]:shadow-none px-6 py-3 text-slate-500 font-medium">
                    Experiments <span className="ml-2 text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-600 dark:text-slate-400">{project.experiments.length}</span>
                </TabsTrigger>
                <TabsTrigger value="literature" className="rounded-none border-b-2 border-transparent data-[state=active]:border-teal-600 data-[state=active]:bg-transparent data-[state=active]:text-teal-700 data-[state=active]:shadow-none px-6 py-3 text-slate-500 font-medium">
                    Literature <span className="ml-2 text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full text-slate-600 dark:text-slate-400">{project.literatures.length}</span>
                </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                 <Card className="border-0 shadow-none bg-transparent">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg font-semibold text-slate-900 dark:text-slate-200">Abstract / Context</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 prose prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed">
                        {project.description ? (
                            <div className="whitespace-pre-wrap">{project.description}</div>
                        ) : (
                            <p className="italic text-slate-400">No detailed description provided for this investigation.</p>
                        )}
                    </CardContent>
                 </Card>
            </TabsContent>

            {/* Experiments Tab */}
            <TabsContent value="experiments" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">Experimental Records</h3>
                    <Link href={`/experiments/new?projectId=${project.id}`}>
                        <Button size="sm" className="bg-teal-700 hover:bg-teal-800 text-white rounded-sm"><Plus className="w-4 h-4 mr-2"/> Log Experiment</Button>
                    </Link>
                </div>
                
                {project.experiments.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center rounded-sm text-slate-500">
                        <FlaskConical className="w-10 h-10 mb-4 mx-auto opacity-20"/>
                        <p>No experiments recorded yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {project.experiments.map(exp => (
                            <Card key={exp.id} className="hover:border-teal-500/40 transition-colors cursor-pointer border-slate-200 dark:border-slate-800 rounded-sm shadow-sm">
                                <CardHeader className="py-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-200">{exp.title}</CardTitle>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                                                <span className="flex items-center">
                                                    <Calendar className="w-3 h-3 mr-1"/> {new Date(exp.date).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                                                </span>
                                                <Badge variant="secondary" className="rounded-sm text-[10px] h-5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-0">{exp.status}</Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/experiments/${exp.id}/edit`}>
                                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-teal-600 transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <DeleteButton 
                                                onDelete={async () => {
                                                    "use server"
                                                    await deleteExperiment(exp.id, project.id)
                                                }}
                                                confirmTitle="Delete Experiment Entry?"
                                                confirmDescription="This will permanently remove this laboratory record."
                                                size="sm"
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </TabsContent>

            {/* Literature Tab */}
            <TabsContent value="literature" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">References</h3>
                    <AddLiteratureDialog projectId={project.id} />
                </div>
                 {project.literatures.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center rounded-sm text-slate-500">
                        <BookOpen className="w-10 h-10 mb-4 mx-auto opacity-20"/>
                        <p>No literature linked to this project.</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {project.literatures.map(lit => (
                            <Card key={lit.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/80 transition rounded-sm border-slate-200 dark:border-slate-800 shadow-sm">
                                <CardContent className="p-4 flex justify-between items-start">
                                    <div className="space-y-1">
                                        <Link href={`/literature/${lit.id}`}>
                                            <h4 className="font-medium text-slate-900 dark:text-slate-200 leading-snug hover:text-teal-600 transition-colors">{lit.title}</h4>
                                        </Link>
                                        <p className="text-sm text-slate-500">{lit.authors} {lit.year ? `(${lit.year})` : ''}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {lit.url && (
                                            <a href={lit.url} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 p-1">
                                                <ExternalLink className="w-4 h-4"/>
                                            </a>
                                        )}
                                        <DeleteButton 
                                            onDelete={async () => {
                                                "use server"
                                                await deleteLiteratureFromProject(lit.id, project.id)
                                            }}
                                            confirmTitle="Delete Literature Entry?"
                                            size="sm"
                                        />
                                    </div>
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
