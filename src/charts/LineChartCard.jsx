import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Users } from "lucide-react";

export const LineChartCard = ({ title, data, dataKey }) => (
  <div className="glass-card rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <Users className="w-5 h-5 text-blue-500" />
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
    </div>
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-10" />
        <XAxis dataKey="month" stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
        <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: 12, border: "none" }} itemStyle={{ color: "#fff" }} />
        <Line type="monotone" dataKey={dataKey} stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);
