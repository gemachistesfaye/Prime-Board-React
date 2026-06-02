import { useState, useEffect } from "react";
import StatCard from "../components/dashboard/StatCard";
import { dashboardStats } from "../data/dashboardData";
import { Calendar, Download } from "lucide-react";
import PieChartCard from "../charts/PieChartCard";
import { LineChartCard } from "../charts/LineChartCard";
import { Table } from "../components/Table/Table";
import { lineChartData, users } from "../data/mockData";

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(() => new Date().toLocaleString("default", { month: "long", year: "numeric" }));

  useEffect(() => {
    const updateMonth = () => {
      setCurrentMonth(new Date().toLocaleString("default", { month: "long", year: "numeric" }));
    };
    // Update every minute to keep it current
    const intervalId = setInterval(updateMonth, 60000);
    // Also update immediately in case of delayed start
    updateMonth();
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Monitor your key metrics and system performance
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
            <Calendar size={18} />
            <span>{currentMonth}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95">
            <Download size={18} />
            <span className="hidden sm:inline">Export Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            changeType={stat.changeType}
            period={stat.period}
            data={stat.data}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LineChartCard title="Active Users Growth" dataKey="users" data={lineChartData} />
        <PieChartCard />
      </div>

      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Recent Team Activity</h2>
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            View All
          </button>
        </div>
        <Table 
          columns={["Name", "Email", "Role", "Status"]} 
          data={users.slice(0, 4)} 
        />
      </div>
    </div>
  );
}
