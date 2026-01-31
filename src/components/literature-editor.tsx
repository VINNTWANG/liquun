"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { updateLiterature, deleteLiterature } from "@/actions/literature-update-actions"
import { useState, useTransition } from "react"
import { Save, ExternalLink } from "lucide-react"
import { MarkdownPreview } from "@/components/markdown-preview"
import { DeleteButton } from "@/components/delete-button"

type Literature = {
    id: string;
    title: string;
    authors: string | null;
    year: number | null;
    url: string | null;
    status: string;
    notes: string | null;
}

export function LiteratureEditor({ literature }: { literature: Literature }) {
    const [notes, setNotes] = useState(literature.notes || "")
    const [isPending, startTransition] = useTransition()

    const updateWithId = updateLiterature.bind(null, literature.id)
    const deleteWithId = deleteLiterature.bind(null, literature.id)

    return (
        <form action={updateWithId} className="space-y-6">
            {/* Header Metadata Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" defaultValue={literature.title} className="font-bold text-lg"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="authors">Authors</Label>
                            <Input id="authors" name="authors" defaultValue={literature.authors || ""} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="url">Link / DOI</Label>
                            <div className="flex gap-2">
                                <Input id="url" name="url" defaultValue={literature.url || ""} className="flex-1" />
                                {literature.url && (
                                    <Button size="icon" variant="outline" type="button" asChild>
                                        <a href={literature.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4"/></a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 bg-slate-50 p-4 rounded-lg border">
                    <div className="space-y-2">
                        <Label htmlFor="status">Reading Status</Label>
                        <Select name="status" defaultValue={literature.status}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="unread">Unread</SelectItem>
                                <SelectItem value="reading">Reading</SelectItem>
                                <SelectItem value="read">Read (Done)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Input id="year" name="year" type="number" defaultValue={literature.year || ""} />
                    </div>
                    
                    <div className="pt-4 flex gap-2 justify-end">
                         <DeleteButton 
                            onDelete={async () => deleteWithId()}
                            variant="destructive"
                            size="sm"
                            confirmTitle="Delete Literature Entry?"
                            confirmDescription="This will permanently remove this paper and your associated reading notes."
                         />
                    </div>
                </div>
            </div>

            {/* Notes Editor Section */}
            <div className="space-y-2">
                <Label className="text-lg">Reading Notes</Label>
                <Tabs defaultValue="write" className="w-full">
                    <TabsList>
                        <TabsTrigger value="write">Write</TabsTrigger>
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="write">
                        <Textarea 
                            id="notes" 
                            name="notes" 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="min-h-[500px] font-mono text-sm leading-relaxed" 
                            placeholder="Write your key takeaways, methodology notes, and critiques here. LaTeX supported: $E=mc^2$"
                        />
                         <p className="text-xs text-muted-foreground mt-2">Markdown supported.</p>
                    </TabsContent>
                    <TabsContent value="preview">
                        <Card>
                            <CardContent className="min-h-[500px] py-4">
                                <MarkdownPreview content={notes} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
            
            <div className="sticky bottom-4 flex justify-end">
                <Button type="submit" size="lg" className="shadow-lg bg-violet-600 hover:bg-violet-700">
                    <Save className="w-4 h-4 mr-2"/> Save Changes
                </Button>
            </div>
        </form>
    )
}
