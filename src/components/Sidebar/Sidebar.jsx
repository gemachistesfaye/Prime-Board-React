import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Megaphone,
  GraduationCap,
  Briefcase,
  Settings,
  Menu,
  X,
  Crown, PenTool
} from "lucide-react";

const navItems = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Announcements", path: "/announcements", icon: Megaphone },
  {
    name: "Students",
    path: "/students",
    icon: GraduationCap,

  },
  { name: "Toolkit", path: "/toolkit", icon: Briefcase },
  { name: "Posts", path: "/posts", icon: PenTool },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {!isOpen && (
        <button
          className="md:hidden fixed top-3.5 left-4 z-[60] p-1.5 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
        >
          <Menu size={24} />
        </button>
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full z-[70] w-64 glass-panel text-slate-700 dark:text-slate-200
          flex flex-col p-6 border-r border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-3 text-xl font-black tracking-tight text-slate-900 dark:text-white cursor-default whitespace-nowrap">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 dark:from-blue-700 dark:to-indigo-900 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/40 dark:shadow-indigo-500/40 border border-orange-500/20 dark:border-indigo-500/20 transition-colors">
              <Crown className="w-4 h-4 text-white dark:text-amber-400 fill-white/20 dark:fill-amber-400/20 transition-colors" />
            </div>
            <span>Prime Board</span>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden p-2 -mr-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="h-px bg-slate-200 dark:bg-slate-800/80 w-full mb-6 mt-6" />
        <nav className="flex flex-col gap-1.5 flex-grow">
          {navItems.map((item) => (
            <div key={item.name}>
              <NavLink
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 px-4 py-3 rounded-xl 
                   text-slate-600 dark:text-slate-300 font-medium transition-all duration-200
                   hover:bg-slate-100 hover:text-blue-600
                   dark:hover:bg-slate-800 active:scale-[0.98] cursor-pointer
                   ${isActive ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-500 font-semibold border border-slate-200/80 dark:border-slate-700/50' : ''}`
                }
              >
                <item.icon size={20} className="text-current" />
                <span>{item.name}</span>
              </NavLink>

              {item.children && (
                <div className="ml-6 flex flex-col gap-1 mt-1">
                  {item.children.map((child) => (
                    <NavLink
                      key={child.name}
                      to={child.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `text-slate-600 dark:text-slate-300 text-sm px-4 py-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800
                         ${isActive ? 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-500 font-semibold border border-slate-200/80 dark:border-slate-700/50' : ''}`
                      }
                    >
                      {child.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-6 flex flex-col gap-4">
          <div className="h-px bg-slate-200 dark:bg-slate-700 w-full" />
          <NavLink
            to="/settings"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-500 cursor-pointer text-sm transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Settings size={18} />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/25 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
