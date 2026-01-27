"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createExperiment } from "@/actions/experiment-actions"
import Link from "next/link"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

type Project = {
    id: string;
    title: string;
}

export function ExperimentForm({ projects, defaultProjectId }: { projects: Project[], defaultProjectId?: string }) {
  const [content, setContent] = useState("")

  return (
    <div className="max-w-4xl mx-auto p-8">
        <div className="mb-8">
            <h1 className="text-3xl font-bold">Log New Experiment</h1>
            <p className="text-muted-foreground">Record your methodology, observations, and results.</p>
        </div>
        
        <form action={createExperiment} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Experiment Title</Label>
                    <Input id="title" name="title" required placeholder="e.g. Optimization of Catalyst X" className="text-lg font-medium"/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input 
                        id="date" 
                        name="date" 
                        type="date" 
                        defaultValue={new Date().toISOString().split('T')[0]} 
                        required 
                    />
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="projectId">Linked Project</Label>
                    <div className="relative">
                        <select 
                            id="projectId"
                            name="projectId" 
                            className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue={defaultProjectId || ""}
                            required
                        >
                            <option value="" disabled>Select a Project...</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                 <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <div className="relative">
                        <select 
                            id="status"
                            name="status" 
                            className="flex h-10 w-full appearance-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            defaultValue="planned"
                        >
                            <option value="planned">Planned</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="failed">Failed</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tags">Tags (optional)</Label>
                    <Input id="tags" name="tags" placeholder="e.g. #synthesis, #failed" />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Notebook Content</Label>
                <Tabs defaultValue="write" className="w-full">
                    <TabsList>
                        <TabsTrigger value="write">Write</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="write">
                        <Textarea 
                            id="content" 
                            name="content" 
                            className="min-h-[400px] font-mono text-sm leading-relaxed" 
                            placeholder="# Hypothesis&#10;&#10;We believe that...&#10;&#10;# Procedure&#10;&#10;1. Prepare sample..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                         <p className="text-xs text-muted-foreground mt-2">Supports basic Markdown: # H1, ## H2, - List, **Bold**, etc.</p>
                    </TabsContent>
                    <TabsContent value="preview">
                        <Card>
                            <CardContent className="min-h-[400px] py-4 prose prose-slate max-w-none">
                                {content ? (
                                    <div className="whitespace-pre-wrap">{content}</div>
                                ) : (
                                    <div className="text-muted-foreground italic">Nothing to preview yet.</div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
               
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Link href="/experiments">
                    <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" className="bg-violet-600 hover:bg-violet-700 min-w-[150px]">Save Experiment</Button>
            </div>
        </form>
    </div>
  )
}
