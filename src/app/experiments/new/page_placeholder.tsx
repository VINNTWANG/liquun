"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createExperiment } from "@/actions/experiment-actions"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

// We need to fetch projects client-side or pass them as props. 
// Since this was a server component, let's keep the data fetching part but make the form interactive.
// However, to use standard React hooks like useState, we need "use client".
// So we will refactor: Page (Server) -> Form (Client)
// But for simplicity in this file replacement, I will implement a hybrid approach 
// where I fetch data via a separate prop or just use standard fetch if I were refactoring more deeply.
// To stick to the current pattern without creating new files excessively, 
// I will keep the page as a Client Component but I need to pass data to it? 
// Actually, Next.js Server Actions work fine in Client Components.
// The issue is fetching 'projects' in a Client Component directly via DB calls is not allowed.
// I will revert to a Server Component that renders a Client Form Component. 
// BUT, to save complexity, I will just make this file a Server Component that imports a new Client Component for the form.

// Wait, strictly speaking, I can't put "use client" at the top of a file that does `db.project.findMany`.
// So I will split this into `page.tsx` (Server) and `experiment-form.tsx` (Client).

export default function NewExperimentPageWrapper(props: any) {
  return <NewExperimentPage {...props} />
}

function NewExperimentPage({ searchParams }: { searchParams: Promise<{ projectId?: string }> }) {
   // This is a placeholder. I will perform the split in the actual tool execution.
   return null;
}
