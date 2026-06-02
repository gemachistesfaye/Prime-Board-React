import { GraduationCap, BookOpen, DollarSign, Activity } from "lucide-react";

export const dashboardStats = [
  {
    id: "stat-1",
    title: "Total Students",
    value: "1,240",
    change: "12.5%",
    icon: <GraduationCap size={20} />,
    period: "last semester",
    data: [400, 450, 600, 550, 700, 850, 1000, 1100, 1240],
  },
  {
    id: "stat-2",
    title: "Courses Active",
    value: "86",
    change: "8.2%",
    icon: <BookOpen size={20} />,
    period: "this semester",
    data: [60, 62, 65, 68, 72, 75, 78, 82, 86],
  },
  {
    id: "stat-3",
    title: "Tuition Collected",
    value: "$245,800",
    change: "15.1%",
    icon: <DollarSign size={20} />,
    period: "this quarter",
    data: [80000, 95000, 120000, 148000, 170000, 195000, 215000, 230000, 245800],
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
