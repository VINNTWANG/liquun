"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  FolderKanban, 
  FlaskConical, 
  BookOpen, 
  Calendar,
  Microscope // New icon for a more scientific feel
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const routes = [
  {
    label: "Overview", // Simpler, English labels are common in international labs
    icon: LayoutDashboard,
    href: "/",
  },
  {
    label: "Projects",
    icon: FolderKanban,
    href: "/projects",
  },
  {
    label: "Notebook",
    icon: FlaskConical,
    href: "/experiments",
  },
  {
    label: "Publications",
    icon: BookOpen,
    href: "/literature",
  },
  {
    label: "Schedule",
    icon: Calendar,
    href: "/schedule",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-300 border-r border-slate-800">
      {/* Header / Brand */}
      <div className="px-6 py-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-teal-600/10 p-2 rounded-md border border-teal-600/20 group-hover:border-teal-600/50 transition-colors">
             <Microscope className="w-6 h-6 text-teal-500" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-100 tracking-tight leading-none">LIQUUN</h1>
            <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-wider">Research Laboratory</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            return (
                <Link
                key={route.href}
                href={route.href}
                className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                    isActive 
                        ? "bg-teal-600/10 text-teal-400 border border-teal-600/20" 
                        : "hover:bg-slate-800 hover:text-slate-100 text-slate-400 border border-transparent"
                )}
                >
                <route.icon className={cn("h-4 w-4", isActive ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300")} />
                {route.label}
                </Link>
            )
          })}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-[#0b1120]">
         <div className="flex items-center justify-between">
             <div className="flex flex-col">
                 <span className="text-xs font-semibold text-slate-400">Zhang-Style System</span>
                 <span className="text-[10px] text-slate-600">v2.0 Build 2026</span>
             </div>
            <ThemeToggle />
         </div>
      </div>
    </div>
  )
}
