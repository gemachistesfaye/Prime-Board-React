import React from "react";
import { Layout } from "../components/Layout/Layout";
import { StackedBarChartCard } from "../charts/StackedBarChartCard";
import { AreaChartCard } from "../charts/AreaChartCard";
import { LineChartCard } from "../charts/LineChartCard";
import { stackedBarData, areaChartData, lineChartData } from "../data/mockData";

const Analytics = () => (
  <Layout>
    <div className="p-6 sm:p-8 space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white transition-colors duration-300">
              Day 9 – Advanced Charts
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400">
            Comprehensive data visualization and performance metrics.
          </p>
        </div>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-8">
        <StackedBarChartCard title="Monthly Product Sales" data={stackedBarData} />
        <AreaChartCard title="Revenue Over Time" data={areaChartData} />
      </div>
      <div className="grid grid-cols-1 gap-8">
        <LineChartCard title="Users Growth (Line Chart)" dataKey="users" data={lineChartData} />
      </div>
      <footer className="pt-8 border-t border-slate-300 dark:border-slate-700 text-center text-slate-500 text-sm italic">
        Data synchronized with BuildSphere Analytics Engine • 2026
      </footer>
    </div>
  </Layout>
);

export default Analytics;
