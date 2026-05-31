import { Users, ShoppingCart, DollarSign, Activity } from "lucide-react";

export const dashboardStats = [
  {
    id: "stat-1",
    title: "Total Users",
    value: "1,240",
    change: "12.5%",
    icon: <Users size={20} />,
    period: "last month",
    data: [400, 450, 600, 550, 700, 850, 1000, 1100, 1240],
  },
  {
    id: "stat-2",
    title: "Orders",
    value: "320",
    change: "8.2%",
    icon: <ShoppingCart size={20} />,
    period: "last month",
    data: [200, 210, 180, 250, 280, 260, 300, 310, 320],
  },
  {
    id: "stat-3",
    title: "Revenue",
    value: "$12,500",
    change: "15.1%",
    icon: <DollarSign size={20} />,
    period: "last month",
    data: [8000, 8500, 9000, 8800, 10000, 11000, 11500, 12000, 12500],
  },
  {
    id: "stat-4",
    title: "Active Now",
    value: "42",
    change: "-2.4%",
    icon: <Activity size={20} />,
    period: "last hour",
    data: [50, 48, 55, 60, 58, 52, 45, 40, 42],
  },
];
