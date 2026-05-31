import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { BarChart3 } from "lucide-react";

export const StackedBarChartCard = ({ title, data }) => (
  <div className="chart-card glass-card rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <BarChart3 className="w-5 h-5 text-indigo-500" />
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
    </div>
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-10" />
        <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
        <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: 12, border: "none", boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: "#fff" }} />
        <Legend iconType="circle" />
        <Bar dataKey="productA" name="Product A" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
        <Bar dataKey="productB" name="Product B" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);
