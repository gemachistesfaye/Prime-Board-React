import React from "react";
import { StackedBarChartCard } from "../charts/StackedBarChartCard";
import { AreaChartCard } from "../charts/AreaChartCard";
import { LineChartCard } from "../charts/LineChartCard";
import { stackedBarData, areaChartData, lineChartData } from "../data/mockData";

const Analytics = () => (
  <div className="space-y-8">
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Advanced Analytics
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Comprehensive academic data visualization and performance metrics.
        </p>
      </div>
    </header>
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
