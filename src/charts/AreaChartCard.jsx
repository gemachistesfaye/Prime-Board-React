import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

export const AreaChartCard = ({ title, data }) => (
  <div className="glass-card rounded-2xl p-6">
    <div className="flex items-center gap-2 mb-4">
      <TrendingUp className="w-5 h-5 text-emerald-500" />
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h2>
    </div>
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:opacity-10" />
        <XAxis dataKey="date" stroke="#64748b" axisLine={false} tickLine={false} fontSize={11} />
        <YAxis stroke="#64748b" axisLine={false} tickLine={false} fontSize={12} />
        <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderRadius: 12, border: "none" }} itemStyle={{ color: "#fff" }} />
        <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={2.5} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
