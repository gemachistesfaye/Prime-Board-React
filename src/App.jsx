import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import Navbar from "./components/Navbar/Navbar";

// Removed direct Sidebar import – Layout handles it


import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Announcements from "./pages/Announcements";
import Students from "./pages/Students";
import Toolkit from "./pages/Toolkit";
import Settings from "./pages/Settings";
import Posts from "./pages/Posts";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("primeboard_theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
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
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/students" element={<Students />} />
          <Route path="/toolkit" element={<Toolkit />} />
          <Route path="/settings" element={<Settings isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />} />
          <Route path="/posts" element={<Posts />} />
        </Routes>
      </Layout>
    </Router>
  );
}