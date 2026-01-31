"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type PlateType =
  | "dish-6cm"
  | "dish-10cm"
  | "plate-6"
  | "plate-12"
  | "plate-24"
  | "plate-48"
  | "plate-96"
  | "plate-384"
  | "strip-8"

type WellData = {
  label?: string
  color?: string
  experiment?: string
  additives?: string
  cellInfo?: string
  status?: string
  virus?: string
  transfection?: string
  drug?: string
  mix?: string
  notes?: string
}

export type PlateMapValue = {
  plateType: PlateType
  shape: "circle" | "square"
  wells: Record<string, WellData>
}

const PLATE_LAYOUTS: Record<PlateType, { rows: number; cols: number; label: string }> = {
  "dish-6cm": { rows: 1, cols: 1, label: "6 cm Dish" },
  "dish-10cm": { rows: 1, cols: 1, label: "10 cm Dish" },
  "plate-6": { rows: 2, cols: 3, label: "6‑Well Plate" },
  "plate-12": { rows: 3, cols: 4, label: "12‑Well Plate" },
  "plate-24": { rows: 4, cols: 6, label: "24‑Well Plate" },
  "plate-48": { rows: 6, cols: 8, label: "48‑Well Plate" },
  "plate-96": { rows: 8, cols: 12, label: "96‑Well Plate" },
  "plate-384": { rows: 16, cols: 24, label: "384‑Well Plate" },
  "strip-8": { rows: 1, cols: 8, label: "8‑Tube Strip (PCR/qPCR)" }
}

const COLOR_OPTIONS = [
  { name: "Teal", value: "#0d9488" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Slate", value: "#64748b" }
]

const rowLabel = (index: number) => String.fromCharCode(65 + index)

function buildWellIds(rows: number, cols: number, mode: "alpha" | "strip") {
  const ids: string[] = []
  if (mode === "strip") {
    for (let c = 1; c <= cols; c += 1) {
      ids.push(`T${c}`)
    }
  } else {
    for (let r = 0; r < rows; r += 1) {
      for (let c = 1; c <= cols; c += 1) {
        ids.push(`${rowLabel(r)}${c}`)
      }
    }
  }
  return ids
}

function emptyWell(): WellData {
  return {
    label: "",
    color: "",
    experiment: "",
    additives: "",
    cellInfo: "",
    status: "",
    virus: "",
    transfection: "",
    drug: "",
    mix: "",
    notes: ""
  }
}

function getCoords(id: string, mode: "alpha" | "strip") {
  if (mode === "strip") {
    const index = parseInt(id.replace("T", ""), 10)
    if (Number.isNaN(index)) return null
    return { row: 0, col: index - 1 }
  }
  const match = id.match(/^([A-Z]+)(\d+)$/)
  if (!match) return null
  const row = match[1].charCodeAt(0) - 65
  const col = parseInt(match[2], 10) - 1
  return { row, col }
}

function getId(row: number, col: number, mode: "alpha" | "strip") {
  if (mode === "strip") return `T${col + 1}`
  return `${rowLabel(row)}${col + 1}`
}

function buildSvg({
  rows,
  cols,
  wells,
  mode
}: {
  rows: number
  cols: number
  wells: Record<string, WellData>
  mode: "alpha" | "strip"
}) {
  const cellSize = rows * cols > 96 ? 22 : 34
  const padding = 16
  const width = cols * cellSize + padding * 2
  const height = rows * cellSize + padding * 2

  const cells = []
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const id = getId(r, c, mode)
      const well = wells[id] || {}
      const x = padding + c * cellSize
      const y = padding + r * cellSize
      const fill = well.color || "#ffffff"
      const label = (well.label || id).slice(0, 6)
      cells.push(
        `<rect x="${x}" y="${y}" width="${cellSize - 2}" height="${cellSize - 2}" rx="4" ry="4" fill="${fill}" stroke="#94a3b8" stroke-width="1" />` +
          `<text x="${x + cellSize / 2 - 1}" y="${y + cellSize / 2 + 3}" font-size="${
            rows * cols > 96 ? 6 : 8
          }" text-anchor="middle" fill="#0f172a">${label}</text>`
      )
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect width="100%" height="100%" fill="#f8fafc" />
  ${cells.join("\n")}
</svg>`
}

export function PlateMapEditor({
  value,
  onChange
}: {
  value: PlateMapValue
  onChange: (next: PlateMapValue) => void
}) {
  const layout = PLATE_LAYOUTS[value.plateType]
  const mode = value.plateType === "strip-8" ? "strip" : "alpha"
  const wellIds = useMemo(() => buildWellIds(layout.rows, layout.cols, mode), [layout.rows, layout.cols, mode])
  const [selectedWell, setSelectedWell] = useState<string>(layout.rows === 1 ? wellIds[0] : wellIds[0])

  const updateWell = (id: string, patch: Partial<WellData>) => {
    onChange({
      ...value,
      wells: {
        ...value.wells,
        [id]: {
          ...emptyWell(),
          ...value.wells[id],
          ...patch
        }
      }
    })
  }

  const clearPlate = () => {
    onChange({ ...value, wells: {} })
  }

  const copyFromSelected = (target: string[]) => {
    const source = value.wells[selectedWell] || emptyWell()
    const next = { ...value.wells }
    target.forEach((id) => {
      next[id] = { ...source }
    })
    onChange({ ...value, wells: next })
  }

  const copyRight = () => {
    const coords = getCoords(selectedWell, mode)
    if (!coords) return
    if (coords.col + 1 >= layout.cols) return
    copyFromSelected([getId(coords.row, coords.col + 1, mode)])
  }

  const copyDown = () => {
    const coords = getCoords(selectedWell, mode)
    if (!coords) return
    if (coords.row + 1 >= layout.rows) return
    copyFromSelected([getId(coords.row + 1, coords.col, mode)])
  }

  const copyRow = () => {
    const coords = getCoords(selectedWell, mode)
    if (!coords) return
    const targets = []
    for (let c = 0; c < layout.cols; c += 1) {
      targets.push(getId(coords.row, c, mode))
    }
    copyFromSelected(targets)
  }

  const copyColumn = () => {
    const coords = getCoords(selectedWell, mode)
    if (!coords) return
    const targets = []
    for (let r = 0; r < layout.rows; r += 1) {
      targets.push(getId(r, coords.col, mode))
    }
    copyFromSelected(targets)
  }

  const copyAll = () => {
    copyFromSelected(wellIds)
  }

  const downloadCsv = () => {
    const headers = [
      "Well",
      "Label",
      "Experiment",
      "CellInfo",
      "Status",
      "Additives",
      "Virus",
      "Transfection",
      "Drug",
      "Mix",
      "Notes"
    ]
    const rows = wellIds.map((id) => {
      const well = value.wells[id] || {}
      const cells = [
        id,
        well.label || "",
        well.experiment || "",
        well.cellInfo || "",
        well.status || "",
        well.additives || "",
        well.virus || "",
        well.transfection || "",
        well.drug || "",
        well.mix || "",
        well.notes || ""
      ]
      return cells.map((cell) => `"${String(cell).replace(/\"/g, '""')}"`).join(",")
    })
    const csv = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "plate-map.csv"
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const downloadSvg = () => {
    const svg = buildSvg({
      rows: layout.rows,
      cols: layout.cols,
      wells: value.wells,
      mode
    })
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = "plate-map.svg"
    link.click()
    URL.revokeObjectURL(link.href)
  }

  const currentWell = value.wells[selectedWell] || emptyWell()
  const isDish = layout.rows === 1 && layout.cols === 1
  const isStrip = value.plateType === "strip-8"
  const isCompact = layout.rows * layout.cols >= 96
  const gridMinWidth = layout.cols * (isCompact ? 36 : 64)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Plate Type</Label>
          <select
            value={value.plateType}
            onChange={(event) => {
              const nextType = event.target.value as PlateType
              const nextLayout = PLATE_LAYOUTS[nextType]
              const nextMode = nextType === "strip-8" ? "strip" : "alpha"
              const nextWell = buildWellIds(nextLayout.rows, nextLayout.cols, nextMode)[0]
              setSelectedWell(nextWell)
              onChange({ ...value, plateType: nextType })
            }}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {Object.entries(PLATE_LAYOUTS).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Well Shape</Label>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={value.shape === "circle" ? "default" : "outline"}
              onClick={() => onChange({ ...value, shape: "circle" })}
            >
              Circle
            </Button>
            <Button
              type="button"
              size="sm"
              variant={value.shape === "square" ? "default" : "outline"}
              onClick={() => onChange({ ...value, shape: "square" })}
            >
              Square
            </Button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button type="button" variant="outline" size="sm" onClick={downloadCsv}>
            Export CSV
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={downloadSvg}>
            Export SVG
          </Button>
          <Button type="button" variant="ghost" onClick={clearPlate}>
            Clear Plate
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,_360px)_1fr]">
        <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="flex flex-wrap gap-2 pb-3">
            <Button type="button" size="sm" variant="outline" onClick={copyRight}>
              Copy Right
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={copyDown}>
              Copy Down
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={copyRow}>
              Copy Row
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={copyColumn}>
              Copy Column
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={copyAll}>
              Copy All
            </Button>
          </div>
          <div
            className={cn("grid gap-2", isCompact && "max-h-[420px] overflow-auto pr-1")}
            style={{
              gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`,
              minWidth: `${gridMinWidth}px`
            }}
          >
            {wellIds.map((id) => {
              const hasContent = Object.values(value.wells[id] || {}).some(
                (field) => (field || "").trim().length > 0
              )
              const selected = id === selectedWell
              const tag = (value.wells[id]?.label || "").trim()
              const color = (value.wells[id]?.color || "").trim()
              const tooltip = [
                id,
                tag ? `Tag: ${tag}` : "",
                value.wells[id]?.experiment ? `Exp: ${value.wells[id]?.experiment}` : ""
              ]
                .filter(Boolean)
                .join(" | ")
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedWell(id)}
                  className={cn(
                    "relative flex w-full items-center justify-center border text-xs font-semibold transition",
                    isCompact ? "h-8 text-[10px]" : "h-12",
                    value.shape === "circle" ? "rounded-full" : "rounded-md",
                    selected ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-500",
                    hasContent && !selected && "border-teal-300 bg-teal-50/60 text-teal-700",
                    "hover:border-teal-400"
                  )}
                  title={tooltip}
                >
                  <span>{isDish ? layout.label : id}</span>
                  {tag && !isCompact && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-medium text-teal-700 truncate max-w-[80%]">
                      {tag}
                    </span>
                  )}
                  {color && (
                    <span
                      className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full border border-white"
                      style={{ backgroundColor: color }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/60">
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {isDish ? layout.label : `Well ${selectedWell}`}
            </h4>
            <p className="text-xs text-slate-500">Record what happened in this location.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="well-label">Tag</Label>
              <Input
                id="well-label"
                value={currentWell.label || ""}
                onChange={(event) => updateWell(selectedWell, { label: event.target.value })}
                placeholder={isStrip ? "Tube label (e.g. NTC, Std1)" : "Short label"}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm">Tag Color</Label>
              <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => updateWell(selectedWell, { color: color.value })}
                    className={cn(
                      "h-7 w-7 rounded-full border transition",
                      currentWell.color === color.value ? "border-slate-900" : "border-slate-200"
                    )}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => updateWell(selectedWell, { color: "" })}
                  className="h-7 w-7 rounded-full border border-dashed border-slate-300 text-[10px] text-slate-500"
                >
                  off
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="well-experiment">Experiment</Label>
              <Input
                id="well-experiment"
                value={currentWell.experiment || ""}
                onChange={(event) => updateWell(selectedWell, { experiment: event.target.value })}
                placeholder="IF staining, infection, treatment..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="well-cell">Cell Info</Label>
              <Input
                id="well-cell"
                value={currentWell.cellInfo || ""}
                onChange={(event) => updateWell(selectedWell, { cellInfo: event.target.value })}
                placeholder="Cell line / passage / density"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="well-status">Status</Label>
              <Input
                id="well-status"
                value={currentWell.status || ""}
                onChange={(event) => updateWell(selectedWell, { status: event.target.value })}
                placeholder="Healthy, stressed, confluent..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="well-additives">Additives</Label>
              <Input
                id="well-additives"
                value={currentWell.additives || ""}
                onChange={(event) => updateWell(selectedWell, { additives: event.target.value })}
                placeholder="Serum, cytokines, inhibitors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="well-virus">Virus</Label>
              <Input
                id="well-virus"
                value={currentWell.virus || ""}
                onChange={(event) => updateWell(selectedWell, { virus: event.target.value })}
                placeholder="Virus / MOI / time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="well-transfection">Transfection</Label>
              <Input
                id="well-transfection"
                value={currentWell.transfection || ""}
                onChange={(event) => updateWell(selectedWell, { transfection: event.target.value })}
                placeholder="Reagent / DNA / siRNA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="well-drug">Drug / Treatment</Label>
              <Input
                id="well-drug"
                value={currentWell.drug || ""}
                onChange={(event) => updateWell(selectedWell, { drug: event.target.value })}
                placeholder="Compound / dose / schedule"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="well-mix">Reaction Mix</Label>
              <Input
                id="well-mix"
                value={currentWell.mix || ""}
                onChange={(event) => updateWell(selectedWell, { mix: event.target.value })}
                placeholder={isStrip ? "Master mix / volume / primers" : "Mix / buffer / ratio"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="well-notes">Notes</Label>
            <Textarea
              id="well-notes"
              value={currentWell.notes || ""}
              onChange={(event) => updateWell(selectedWell, { notes: event.target.value })}
              placeholder="Observations, morphology, next steps…"
              className="min-h-[120px]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
