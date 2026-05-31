import { Sidebar } from "../Sidebar/Sidebar";

export const Layout = ({ children, isDarkMode = false }) => {
  return (
    <div className={`min-h-screen ${isDarkMode ? "dark" : ""} bg-transparent`}>
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="p-4 sm:p-6 md:p-8 overflow-x-hidden md:ml-64">
        {children}
      </main>

    </div>
  );
};
