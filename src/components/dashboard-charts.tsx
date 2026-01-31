"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Teal-focused palette for scientific visualization
const COLORS = ['#0d9488', '#0f172a', '#94a3b8', '#ccfbf1'];

interface ChartData {
    activityData: { name: string, total: number }[]
    distributionData: { name: string, value: number }[]
}

export function DashboardCharts({ activityData, distributionData }: ChartData) {
  
  // Custom Tooltip for Bar Chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-sm shadow-lg">
          <p className="text-xs font-bold text-slate-500 uppercase">{label}</p>
          <p className="text-sm font-semibold text-teal-700 dark:text-teal-400">
            {payload[0].value} Experiments
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <Card className="shadow-sm border border-slate-200 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-900/50">
            <CardHeader>
                <CardTitle className="text-base font-medium text-slate-900 dark:text-slate-100">Research Velocity (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activityData}>
                            <XAxis 
                                dataKey="name" 
                                stroke="#94a3b8" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                dy={10}
                            />
                            <YAxis 
                                stroke="#94a3b8" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                                tickFormatter={(value) => `${value}`} 
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                            <Bar 
                                dataKey="total" 
                                fill="#0d9488" 
                                radius={[2, 2, 0, 0]} 
                                activeBar={{ fill: '#0f766e' }}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-200 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-900/50">
            <CardHeader>
                <CardTitle className="text-base font-medium text-slate-900 dark:text-slate-100">Project Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[250px] w-full flex items-center justify-center">
                    {distributionData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-sm text-slate-400">No project data available.</div>
                    )}
                </div>
                {/* Legend */}
                <div className="flex justify-center gap-4 mt-[-20px]">
                    {distributionData.map((entry, index) => (
                        <div key={entry.name} className="flex items-center gap-2 text-xs text-slate-500">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            {entry.name} ({entry.value})
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
