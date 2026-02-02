"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createExperiment, updateExperiment } from "@/actions/experiment-actions"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { MarkdownPreview } from "@/components/markdown-preview"
import { toast } from "sonner"
import { toLocalDateTimeInputValue } from "@/lib/datetime"
import { PlateMapEditor, PlateMapValue } from "@/components/plate-map-editor"

const EXPERIMENT_TEMPLATES = {
    "life-science": {
        label: "Life Science",
        summary: "Structured lab notebook with controls, QC, and data links.",
        content: `# Study Overview

## Objective / Hypothesis

## Background

## Materials
- Samples:
- Reagents:
- Equipment:

## Methods
1.

## Results
- Raw observations:
- Key metrics:

## QC & Controls
- Positive control:
- Negative control:
- Replicates:

## Interpretation

## Next Steps

## Data / Files
- File paths / IDs:
`
    },
    "cell-plate": {
        label: "Cell Plate (96/384)",
        summary: "Plate layout, dosing map, timeline, and readout plan.",
        content: `# Plate-Based Assay

## Objective

## Plate Setup
- Plate type: 96 / 384
- Coating:
- Seeding density:
- Media:

## Treatment Layout
- Controls:
- Treatments (dose/time):
- Replicates:
- Randomization:

## Timeline
- T0:
- T24:
- T48:

## Readouts
- Assay:
- Instrument:
- Settings:

## Results
- Raw data:
- QC:

## Notes / Next Steps
`
    },
    "flow-cytometry": {
        label: "Flow Cytometry",
        summary: "Staining panel, acquisition settings, gating, and stats.",
        content: `# Flow Cytometry

## Objective

## Sample Prep
- Cell source:
- Staining panel:
- Viability dye:

## Instrument
- Cytometer:
- Lasers / filters:
- Compensation:

## Acquisition
- Events:
- Gating strategy:

## Results
- Key populations:
- Statistics:

## Notes / Next Steps
`
    },
    "western-blot": {
        label: "Western Blot (WB)",
        summary: "Sample prep, gel/transfer, antibody map, and detection.",
        content: `# Western Blot

## Objective

## Samples
- Cell/tissue:
- Lysis buffer:
- Protein quant:

## Gel & Transfer
- Gel %:
- Running conditions:
- Transfer (wet/semi-dry):

## Antibodies
- Primary (dilution):
- Secondary (dilution):
- Blocking:

## Detection
- Substrate:
- Imaging system:

## Results
- Band size:
- Quantification:

## Notes / Troubleshooting
`
    },
    pcr: {
        label: "PCR System",
        summary: "Primer design, mix recipe, cycling, and controls.",
        content: `# PCR

## Objective

## Template
- Source:
- Concentration:

## Primers
- Forward:
- Reverse:
- Amplicon size:

## Reaction Mix
- Polymerase / master mix:
- Mg2+:
- dNTPs:
- Primer conc:
- Total volume:

## Cycling Conditions
- Initial denaturation:
- Annealing:
- Extension:
- Cycles:

## Controls
- NTC:
- Positive control:

## Results
- Gel / amplification:

## Notes / Next Steps
`
    },
    qpcr: {
        label: "qPCR System",
        summary: "qPCR setup, standards, and Ct analysis.",
        content: `# qPCR

## Objective

## Template
- Source:
- Concentration:

## Primers / Probes
- Forward:
- Reverse:
- Probe:

## Reaction Mix
- Master mix:
- Primer/probe conc:
- Template input:
- Final volume:

## Cycling Conditions
- Initial denaturation:
- Annealing:
- Extension:
- Cycles:

## Standards / Controls
- NTC:
- Standards:

## Results
- Ct values:
- Melt curve:

## Notes / Next Steps
`
    },
    "pcr-strip": {
        label: "PCR Strip (8-tube)",
        summary: "Eight-tube layout with per-tube labels and reaction mix.",
        content: `# PCR Strip (8‑Tube)

## Objective

## Tube Layout
- T1:
- T2:
- T3:
- T4:
- T5:
- T6:
- T7:
- T8:

## Reaction Mix (per tube)
- Template:
- Primers:
- Master mix:
- Final volume:

## Cycling Conditions
- Initial denaturation:
- Annealing:
- Extension:
- Cycles:

## Controls
- NTC:
- Positive control:

## Results
- Gel / amplification:

## Notes / Next Steps
`
    },
    "qpcr-strip": {
        label: "qPCR Strip (8-tube)",
        summary: "qPCR strip map with Ct tracking and standards.",
        content: `# qPCR Strip (8‑Tube)

## Objective

## Tube Layout
- T1:
- T2:
- T3:
- T4:
- T5:
- T6:
- T7:
- T8:

## Reaction Mix (per tube)
- Template:
- Primers/probes:
- Master mix:
- Final volume:

## Cycling Conditions
- Initial denaturation:
- Annealing:
- Extension:
- Cycles:

## Standards / Controls
- NTC:
- Standards:

## Results
- Ct values:
- Melt curve:

## Notes / Next Steps
`
    },
    immunofluorescence: {
        label: "Immunofluorescence (IF)",
        summary: "Fixation, staining, imaging settings, and quantification.",
        content: `# Immunofluorescence

## Objective

## Sample Prep
- Cell type:
- Fixation:
- Permeabilization:
- Blocking:

## Antibodies
- Primary:
- Secondary:
- Dilutions:

## Stains
- Nuclear:
- Other markers:

## Imaging
- Microscope:
- Objective:
- Exposure:

## Results
- Representative images:
- Quantification:

## Notes / Next Steps
`
    },
    elisa: {
        label: "ELISA",
        summary: "Coating/blocking, standards, and quant outputs.",
        content: `# ELISA

## Objective

## Samples
- Source:
- Dilution:

## Plate
- Coating:
- Blocking:
- Wash buffer:

## Antibodies
- Capture:
- Detection:

## Standards
- Range:
- Replicates:

## Readout
- Substrate:
- Wavelength:

## Results
- Standard curve:
- Calculated concentrations:

## Notes / Troubleshooting
`
    },
    "cell-culture": {
        label: "Cell Culture / Passage",
        summary: "Passage history, media composition, and morphology.",
        content: `# Cell Culture / Passage

## Objective

## Cell Line
- Name:
- Passage #:
- Mycoplasma status:

## Media
- Base medium:
- Supplements:
- Antibiotics:

## Procedure
- Split ratio:
- Seeding density:

## Conditions
- CO2:
- Temp:

## Observations
- Morphology:
- Confluency:

## Notes / Next Steps
`
    },
    "cell-viability": {
        label: "Cell Viability (CCK-8/MTT)",
        summary: "Seeding, treatments, incubation, and OD normalization.",
        content: `# Cell Viability (CCK-8/MTT)

## Objective

## Plate Setup
- Plate type:
- Seeding density:
- Treatments:
- Replicates:

## Assay
- Reagent:
- Incubation time:
- Wavelength:

## Results
- Raw OD:
- Normalization:

## Notes / Next Steps
`
    },
    cloning: {
        label: "Plasmid Cloning / Construction",
        summary: "Vector/insert mapping, assembly, and screening.",
        content: `# Plasmid Cloning / Construction

## Objective

## Vector & Insert
- Vector:
- Insert:
- Enzymes:

## Ligation / Assembly
- Method:
- Molar ratio:

## Transformation
- Strain:
- Selection:

## Screening
- Colony PCR:
- Restriction:
- Sequencing:

## Results

## Notes / Next Steps
`
    },
    "rna-extraction": {
        label: "RNA Extraction / RT",
        summary: "Extraction yield/purity and RT setup.",
        content: `# RNA Extraction / RT

## Objective

## Samples
- Source:
- Lysis reagent:

## Extraction
- Kit:
- Yield:
- Purity (A260/280):

## Reverse Transcription
- Input RNA:
- RT kit:

## Notes / Next Steps
`
    },
    crispr: {
        label: "CRISPR Edit & Screen",
        summary: "sgRNA, delivery, selection, and screening.",
        content: `# CRISPR Edit & Screen

## Objective

## sgRNA Design
- Target:
- sgRNA sequence:

## Delivery
- Method (plasmid/RNP/virus):
- MOI/amount:

## Selection
- Antibiotic:
- Duration:

## Screening
- PCR / sequencing:
- Phenotype assay:

## Results

## Notes / Next Steps
`
    },
    microscopy: {
        label: "Microscopy",
        summary: "Stains, imaging parameters, and image quant.",
        content: `# Microscopy

## Objective

## Sample Prep
- Fixation:
- Staining:
- Mounting:

## Imaging
- Microscope:
- Objective:
- Channels / exposure:

## Results
- Representative images:
- Quantification:

## Notes / Next Steps
`
    },
    chemistry: {
        label: "Chemistry",
        summary: "Reaction conditions, workup, and yield analysis.",
        content: `# Reaction Record

## Objective

## Reaction / Synthesis
- Reagents & stoichiometry:
- Solvent:
- Temperature / time:

## Procedure

## Observations

## Workup & Purification

## Yield & Analysis

## Notes / Next Steps
`
    },
    computational: {
        label: "Computational",
        summary: "Inputs, parameters, and reproducibility checklist.",
        content: `# Computational Experiment

## Objective

## Dataset / Inputs

## Methods / Parameters

## Results

## Reproducibility
- Code / commit:
- Environment:

## Notes / Next Steps
`
    },
    general: {
        label: "General",
        summary: "Lightweight structure for any discipline.",
        content: `# Experiment Note

## Goal

## Method

## Observations

## Results

## Conclusion

## Next Steps
`
    }
} as const

type TemplateKey = keyof typeof EXPERIMENT_TEMPLATES

const DEFAULT_PLATE_MAP: PlateMapValue = {
    plateType: "plate-6",
    shape: "circle",
    stripCount: 1,
    wells: {}
}

function parsePlateMap(raw?: string | null): PlateMapValue {
    if (!raw) return DEFAULT_PLATE_MAP
    try {
        const parsed = typeof raw === "string" ? (JSON.parse(raw) as PlateMapValue) : (raw as PlateMapValue)
        if (!parsed?.plateType || !parsed?.shape || !parsed?.wells) return DEFAULT_PLATE_MAP
        return {
            ...parsed,
            stripCount: parsed.stripCount || 1
        }
    } catch {
        return DEFAULT_PLATE_MAP
    }
}

type Project = {
    id: string;
    title: string;
}

type Experiment = {
    id: string
    title: string
    date: Date
    content: string | null
    status: string
    tags: string | null
    projectId: string
    plateMap?: string | null
    assayType?: string | null
    sampleType?: string | null
    organism?: string | null
    cellLine?: string | null
    strain?: string | null
    biosafetyLevel?: string | null
    protocol?: string | null
    instrument?: string | null
    reagentLot?: string | null
}

interface ExperimentFormProps {
    projects: Project[]
    defaultProjectId?: string
    initialData?: Experiment
}

export function ExperimentForm({ projects, defaultProjectId, initialData }: ExperimentFormProps) {
  const [content, setContent] = useState(initialData?.content || "")
  const [templateKey, setTemplateKey] = useState<TemplateKey>("life-science")
  const [plateMap, setPlateMap] = useState<PlateMapValue>(() => parsePlateMap(initialData?.plateMap))
  const isEditing = !!initialData
  const formAction = isEditing ? updateExperiment.bind(null, initialData.id) : createExperiment
  const selectedTemplate = EXPERIMENT_TEMPLATES[templateKey]

  useEffect(() => {
      if (initialData?.plateMap) {
          setPlateMap(parsePlateMap(initialData.plateMap))
      }
  }, [initialData?.plateMap])

  const applyTemplate = () => {
      const next = EXPERIMENT_TEMPLATES[templateKey].content
      if (content.trim().length > 0) {
          const confirmed = window.confirm("Replace current content with the selected template?")
          if (!confirmed) return
      }
      setContent(next)
  }

  async function handleSubmit(formData: FormData) {
      try {
          await formAction(formData)
          toast.success(isEditing ? "Experiment updated" : "Experiment logged", {
              description: "Your data has been securely saved."
          })
      } catch (error) {
          toast.error("Failed to save experiment", {
              description: "Something went wrong. Please try again."
          })
      }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 shadow-sm dark:bg-slate-950/60 dark:border-slate-800">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.12),_transparent_55%)]" />
            <div className="relative p-6 md:p-8">
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                    {isEditing ? "Edit Experiment Entry" : "Log New Experiment"}
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
                    {isEditing ? "Update your methodology, parameters, and findings with clean structure." : "Capture methodology, observations, and results in a reproducible, structured format."}
                </p>
            </div>
        </div>
        
        <form action={handleSubmit} className="space-y-8 rounded-xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
            <input type="hidden" name="plateMap" value={JSON.stringify(plateMap)} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="title">Experiment Title</Label>
                    <Input 
                        id="title" 
                        name="title" 
                        required 
                        placeholder="e.g. Optimization of Catalyst X" 
                        className="text-lg font-medium"
                        defaultValue={initialData?.title}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="date">Date & Time</Label>
                    <Input 
                        id="date" 
                        name="date" 
                        type="datetime-local"
                        defaultValue={toLocalDateTimeInputValue(initialData?.date || new Date())} 
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
                            defaultValue={initialData?.projectId || defaultProjectId || ""}
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
                            defaultValue={initialData?.status || "planned"}
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
                    <Input 
                        id="tags" 
                        name="tags" 
                        placeholder="e.g. #synthesis, #failed" 
                        defaultValue={initialData?.tags || ""}
                    />
                </div>
            </div>

            <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/40 p-4 space-y-4">
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Experimental Metadata (optional)</h3>
                    <p className="text-xs text-muted-foreground">Life-science friendly, but works across disciplines.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="assayType">Assay / Method</Label>
                        <Input id="assayType" name="assayType" placeholder="qPCR, WB, LC-MS, simulation" defaultValue={initialData?.assayType || ""} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sampleType">Sample / Material</Label>
                        <Input id="sampleType" name="sampleType" placeholder="tissue, cell lysate, catalyst" defaultValue={initialData?.sampleType || ""} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="organism">Organism / Source</Label>
                        <Input id="organism" name="organism" placeholder="H. sapiens, M. musculus" defaultValue={initialData?.organism || ""} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="cellLine">Cell Line</Label>
                        <Input id="cellLine" name="cellLine" placeholder="HEK293, HeLa" defaultValue={initialData?.cellLine || ""} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="strain">Strain / Genotype</Label>
                        <Input id="strain" name="strain" placeholder="BL21, C57BL/6J, KO/WT" defaultValue={initialData?.strain || ""} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="biosafetyLevel">Biosafety / Compliance</Label>
                        <Input id="biosafetyLevel" name="biosafetyLevel" placeholder="BSL-1, BSL-2, CL2" defaultValue={initialData?.biosafetyLevel || ""} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="protocol">Protocol / SOP</Label>
                        <Input id="protocol" name="protocol" placeholder="SOP-123 or URL" defaultValue={initialData?.protocol || ""} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="instrument">Instrument / Platform</Label>
                        <Input id="instrument" name="instrument" placeholder="NovaSeq 6000, Orbitrap" defaultValue={initialData?.instrument || ""} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="reagentLot">Reagent Lot / Batch</Label>
                        <Input id="reagentLot" name="reagentLot" placeholder="Lot #A12345" defaultValue={initialData?.reagentLot || ""} />
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-white p-4 md:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
                <div className="mb-4">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Plate / Dish Map (optional)</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Use the grid to record per‑well or per‑dish conditions, treatments, and observations.
                    </p>
                </div>
                <PlateMapEditor value={plateMap} onChange={setPlateMap} />
            </div>

            <div className="space-y-2">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Label>Notebook Content</Label>
                        <p className="text-xs text-muted-foreground mt-1">Pick a template to prefill a clean structure, then edit as needed.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <select
                            value={templateKey}
                            onChange={(e) => setTemplateKey(e.target.value as TemplateKey)}
                            className="flex h-9 rounded-md border border-input bg-background px-3 text-sm"
                        >
                            {Object.entries(EXPERIMENT_TEMPLATES).map(([key, template]) => (
                                <option key={key} value={key}>{template.label}</option>
                            ))}
                        </select>
                        <Button type="button" variant="outline" size="sm" onClick={applyTemplate}>
                            Insert Template
                        </Button>
                    </div>
                </div>
                <div className="rounded-md border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50 p-4">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedTemplate.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{selectedTemplate.summary}</p>
                </div>
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
                            placeholder="Use a template above or start writing… LaTeX supported: $E=mc^2$ or $$ \\int_0^1 x \\, dx $$"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                         <p className="text-xs text-muted-foreground mt-2">Supports Markdown & LaTeX math ($...$).</p>
                    </TabsContent>
                    <TabsContent value="preview">
                        <Card>
                            <CardContent className="min-h-[400px] py-4">
                                <MarkdownPreview content={content} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
               
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Link href={isEditing ? `/projects/${initialData.projectId}` : "/experiments"}>
                    <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white min-w-[150px]">
                    {isEditing ? "Update Entry" : "Save Experiment"}
                </Button>
            </div>
        </form>
    </div>
  )
}
