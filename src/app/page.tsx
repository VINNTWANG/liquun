import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FlaskConical, FolderKanban, BookOpen, Plus, ArrowRight, Activity } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DashboardCharts } from "@/components/dashboard-charts";
import { subMonths, startOfMonth, format } from "date-fns";

export default async function DashboardPage() {
  // 1. Calculate Date Range for Activity Chart (Last 6 Months)
  const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5)); // Include current month, so go back 5 months

  // Parallel data fetching
  const [
      activeProjectCount, 
      experimentCount, 
      unreadLitCount, 
      recentProjects,
      // Aggregations
      rawExperiments,
      projectStatusDistribution
  ] = await Promise.all([
    db.project.count({ where: { status: 'active' } }),
    db.experiment.count(),
    db.literature.count({ where: { status: 'unread' } }),
    db.project.findMany({ 
        take: 3, 
        orderBy: { updatedAt: 'desc' },
        include: { _count: { select: { experiments: true, literatures: true } } }
    }),
    // Fetch dates of experiments in last 6 months
    db.experiment.findMany({
        where: { date: { gte: sixMonthsAgo } },
        select: { date: true }
    }),
    // Group Projects by Status
    db.project.groupBy({
        by: ['status'],
        _count: { status: true }
    })
  ]);

  // 2. Process Activity Data (JS Aggregation)
  const activityMap = new Map<string, number>();
  // Initialize last 6 months with 0
  for (let i = 0; i < 6; i++) {
      const d = subMonths(new Date(), i);
      const key = format(d, 'MMM'); // e.g., "Jan", "Feb"
      activityMap.set(key, 0);
  }
  
  rawExperiments.forEach(exp => {
      const key = format(exp.date, 'MMM');
      if (activityMap.has(key)) {
          activityMap.set(key, activityMap.get(key)! + 1);
      }
  });

  // Convert Map to Array and Reverse (to show oldest to newest)
  // Note: Iterating Map iterates in insertion order if we inserted them in order. 
  // But we inserted from Newest -> Oldest (loop 0 to 5).
  // So we need to reverse to show time progression left-to-right.
  const activityData = Array.from(activityMap).map(([name, total]) => ({ name, total })).reverse();


  // 3. Process Distribution Data
  const distributionData = projectStatusDistribution.map(item => ({
      name: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Capitalize
      value: item._count.status
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-10">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6">
        <div className="space-y-1">
          <h4 className="text-sm font-mono text-teal-600 uppercase tracking-widest font-semibold">Laboratory Overview</h4>
          <h2 className="text-4xl font-light tracking-tight text-slate-900 dark:text-slate-100">
            Welcome back, <span className="font-semibold">Researcher</span>.
          </h2>
          <p className="text-slate-500 max-w-xl pt-2">
            System status is nominal. You have <span className="font-medium text-slate-900 dark:text-slate-200">{activeProjectCount} active tracks</span> and <span className="font-medium text-slate-900 dark:text-slate-200">{unreadLitCount} new papers</span> for review.
          </p>
        </div>
        <div className="flex gap-3">
           <Link href="/experiments/new">
                <Button variant="outline" className="border-slate-300 dark:border-slate-700">
                    Log Experiment
                </Button>
           </Link>
           <Link href="/projects">
                <Button className="bg-teal-700 hover:bg-teal-800 text-white shadow-none rounded-sm">
                    <Plus className="w-4 h-4 mr-2"/> 
                    Initialize Project
                </Button>
           </Link>
        </div>
      </div>

      {/* KPI Section - Minimalist Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-sm flex flex-col justify-between h-32 hover:border-teal-500/30 transition-colors group">
            <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Active Projects</span>
                <FolderKanban className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors"/>
            </div>
            <div className="text-4xl font-light text-slate-900 dark:text-slate-100">{activeProjectCount}</div>
        </div>
        
        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-sm flex flex-col justify-between h-32 hover:border-teal-500/30 transition-colors group">
            <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Notebook Entries</span>
                <FlaskConical className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors"/>
            </div>
            <div className="text-4xl font-light text-slate-900 dark:text-slate-100">{experimentCount}</div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-6 rounded-sm flex flex-col justify-between h-32 hover:border-teal-500/30 transition-colors group">
            <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">Literature Queue</span>
                <BookOpen className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors"/>
            </div>
            <div className="text-4xl font-light text-slate-900 dark:text-slate-100">{unreadLitCount}</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600"/> Analytics
          </h3>
          <DashboardCharts activityData={activityData} distributionData={distributionData} />
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">Recent Investigations</h3>
            <Link href="/projects" className="text-sm text-teal-700 dark:text-teal-400 hover:underline flex items-center">
                Full Index <ArrowRight className="w-3 h-3 ml-1"/>
            </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
            {recentProjects.map((project) => (
                <Link key={project.id} href={`/projects/${project.id}`}>
                    <Card className="h-full border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all rounded-sm group cursor-pointer bg-white dark:bg-slate-900/50">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Badge variant="outline" className="rounded-none border-teal-200 bg-teal-50 text-teal-900 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800 font-normal">
                                    {project.status}
                                </Badge>
                                <span className="text-xs text-slate-400 font-mono">{new Date(project.updatedAt).toLocaleDateString()}</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <h3 className="font-semibold text-lg group-hover:text-teal-700 transition-colors mb-2 line-clamp-1">{project.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                                {project.description || "No description provided."}
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
             {recentProjects.length === 0 && (
                <div className="col-span-3 text-center py-12 border border-dashed border-slate-300 rounded-sm">
                    <p className="text-slate-500">No active investigations initialized.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}
