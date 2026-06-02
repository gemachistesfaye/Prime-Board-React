import { Sidebar } from "../Sidebar/Sidebar";

export const Layout = ({ children, isDarkMode = false }) => {
  return (
    <div className={`${isDarkMode ? "dark" : ""} min-h-screen bg-transparent`}>

      <Sidebar />

      <main className="
        md:ml-64
        pt-20
        px-4 sm:px-6 md:px-8
        pb-8
        min-h-screen
        overflow-x-hidden
      ">
        {children}
      </main>

    </div>
  );
};