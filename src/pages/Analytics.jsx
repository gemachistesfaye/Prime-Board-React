import { BarChart3 } from "lucide-react";
import { StackedBarChartCard } from "../charts/StackedBarChartCard";
import { AreaChartCard } from "../charts/AreaChartCard";
import { LineChartCard } from "../charts/LineChartCard";
import { stackedBarData, areaChartData, lineChartData } from "../data/mockData";

const Analytics = () => (
  <div className="space-y-8">

    {/* Header — matches Students, Tools, Posts style */}
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
          <BarChart3 size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Academic Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track enrollment trends, revenue and student growth in real time.
          </p>
        </div>
      </div>
    </div>

    {/* Charts */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <StackedBarChartCard title="Enrollment by Department" data={stackedBarData} />
      <AreaChartCard title="Tuition Revenue Over Time" data={areaChartData} />
    </div>
    <div className="grid grid-cols-1 gap-8">
      <LineChartCard title="Student Growth" dataKey="users" data={lineChartData} />
    </div>

    <footer className="pt-8 border-t border-slate-200 dark:border-slate-700 text-center text-slate-400 dark:text-slate-500 text-sm">
      Data synchronized with Prime Board Academic Analytics Engine • 2026
    </footer>
  </div>
);

export default Analytics;