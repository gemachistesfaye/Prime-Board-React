import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/Sidebar/Sidebar";
import Navbar from "./components/Navbar/Navbar";

import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Booking from "./pages/Booking";
import Students from "./pages/Students";
import Toolkit from "./pages/Toolkit";
import Settings from "./pages/Settings";
import UsersTablePage from "./pages/UsersTablePage";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <Router>
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/students" element={<Students />} />
            <Route path="/toolkit" element={<Toolkit />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/students/users" element={<UsersTablePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
