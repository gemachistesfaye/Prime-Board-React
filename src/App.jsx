import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import Navbar from "./components/Navbar/Navbar";

// Removed direct Sidebar import – Layout handles it


import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Booking from "./pages/Booking";
import Students from "./pages/Students";
import Toolkit from "./pages/Toolkit";
import Settings from "./pages/Settings";
import UsersTablePage from "./pages/UsersTablePage";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("primeboard_theme");
    return savedTheme !== "light";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("primeboard_theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <Router>
      <Layout isDarkMode={isDarkMode}>
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/students" element={<Students />} />
          <Route path="/toolkit" element={<Toolkit />} />
          <Route path="/settings" element={<Settings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/students/users" element={<UsersTablePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}