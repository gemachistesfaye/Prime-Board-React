import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BarChartCard = ({ title, dataKey, data }) => {
  return (
    <div className="glass-card rounded-2xl p-4">
      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderRadius: 8, border: 'none' }}
            itemStyle={{ color: '#fff' }}
          />
          <Bar dataKey={dataKey} fill="#f97316" radius={[6, 6, 0, 0]} barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartCard;
