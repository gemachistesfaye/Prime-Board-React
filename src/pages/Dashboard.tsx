import { useState, useEffect } from "react";
import StatCard from "../components/dashboard/StatCard";
import AIInsightsCard from "../components/dashboard/AIInsightsCard";
import { dashboardStats } from "../data/dashboardData";
import { Calendar, Download } from "lucide-react";
import { Layout } from "../components/Layout/Layout";

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState("");

  useEffect(() => {
    const now = new Date();
    const monthName = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();
    setCurrentMonth(`${monthName} ${year}`);
  }, []);

  return (
    <Layout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">📈</span>
            </div>
            <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
              Enterprise Insights
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            <Calendar size={16} />
            <span>{currentMonth}</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl shadow-lg transition-all duration-200 active:scale-95">
            <Download size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.id}
            id={stat.id}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
            period={stat.period}
            data={stat.data}
          />
        ))}
      </div>

      <div className="mt-8">
        <AIInsightsCard
          title="Neural Logic Insight"
          insights={[
            "AI detected a shift in user sentiment toward sustainable features.",
            "Optimizing database indexing could reduce latency by 240ms.",
            "Anomaly detected in region US-EAST-1: potential traffic spike predicted for 14:00 UTC.",
            "New personalization vector available based on last 48 hours of interaction data.",
          ]}
        />
      </div>
    </Layout>
  );
}
