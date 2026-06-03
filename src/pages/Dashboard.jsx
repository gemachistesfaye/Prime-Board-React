import { useState, useEffect } from "react";
import { LayoutDashboard, Download } from "lucide-react";
import StatCard from "../components/dashboard/StatCard";
import { dashboardStats } from "../data/dashboardData";
import PieChartCard from "../charts/PieChartCard";
import { LineChartCard } from "../charts/LineChartCard";
import { Table } from "../components/Table/Table";
import { lineChartData, users } from "../data/mockData";

export default function Dashboard() {
  const [currentDate, setCurrentDate] = useState(() =>
    new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" })
  );

  useEffect(() => {
    const update = () => setCurrentDate(new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-8">

      {/* Header — matches all other pages */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
            <LayoutDashboard size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Prime Board Dashboard
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Monitor student enrollment, course activity and institutional performance.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:self-center shrink-0">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{currentDate}</span>
          <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shadow-md shadow-blue-500/20">
            <Download size={15} /> Export Report
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            period={stat.period}
            data={stat.data}
          />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LineChartCard title="Student Enrollment Growth" dataKey="users" data={lineChartData} />
        <PieChartCard />
      </div>

      {/* Recent Activity Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Student Activity</h2>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors">
            View All
          </button>
        </div>
        <Table columns={["Name", "Email", "Role", "Status"]} data={users.slice(0, 4)} />
      </div>
    </div>
  );
}