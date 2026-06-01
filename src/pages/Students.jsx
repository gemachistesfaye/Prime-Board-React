import React, { useState } from "react";
import { 
  Search, Plus, Edit2, Trash2, CheckCircle2, XCircle, 
  GraduationCap, Download, AlertTriangle, MoreVertical, UserCheck, UserX, FileText, BookOpen
} from 'lucide-react';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const initialStudents = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", status: "Active", coarse: "Computer Science", joined: "2024-01-15", gpa: 3.8, tuition: "Paid", courses: [{name: "Data Structures", credits: 3.0, grade: "A"}, {name: "Algorithms", credits: 3.0, grade: "A-"}] },
  { id: "2", name: "Bob Smith", email: "bob@example.com", status: "Inactive", coarse: "Mathematics", joined: "2024-02-20", gpa: 2.9, tuition: "Pending", courses: [{name: "Calculus I", credits: 4.0, grade: "B"}, {name: "Linear Algebra", credits: 3.0, grade: "C+"}] },
  { id: "3", name: "Carol White", email: "carol@example.com", status: "Active", coarse: "Physics", joined: "2024-03-10", gpa: 3.5, tuition: "Paid", courses: [{name: "Quantum Mechanics", credits: 4.0, grade: "A"}, {name: "Thermodynamics", credits: 3.0, grade: "B+"}] },
  { id: "4", name: "David Brown", email: "david@example.com", status: "Active", coarse: "Chemistry", joined: "2024-04-05", gpa: 3.2, tuition: "Paid", courses: [{name: "Organic Chemistry", credits: 4.0, grade: "B"}, {name: "Inorganic Chemistry", credits: 3.0, grade: "B+"}] },
];

export default function Students() {
  const [students, setStudents] = useState(initialStudents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [printStudent, setPrintStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState('All');
  const [deleteId, setDeleteId] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [modalCourses, setModalCourses] = useState([]);

  const openAddModal = () => {
    setModalCourses([{ name: "", credits: 3.0, grade: "A" }]);
    setShowAddModal(true);
  };

  const updateCourse = (index, field, value) => {
    const newCourses = [...modalCourses];
    newCourses[index][field] = value;
    setModalCourses(newCourses);
  };

  const toggleStatus = (id) => {
    setStudents(prev => prev.map(s => 
      s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s
    ));
    setActiveMenuId(null);
  };

  const handleDownloadTranscript = (student) => {
    const subjects = student.courses && student.courses.length > 0 ? student.courses : [
      { name: "Core Principles of " + student.coarse, credits: 3.0, grade: student.gpa >= 3.5 ? "A" : student.gpa >= 3.0 ? "B" : "C" },
      { name: "Advanced Methodology", credits: 3.0, grade: student.gpa >= 3.2 ? "A-" : "B" },
      { name: "Elective Seminar", credits: 3.0, grade: "A" }
    ];
    
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138); // Blue-900
    doc.text("Prime Board University", 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text("OFFICIAL ACADEMIC TRANSCRIPT", 14, 30);
    
    // Separator line
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.line(14, 35, 196, 35);
    
    // Student Info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42); // Slate-900
    
    doc.text(`Student Name: ${student.name}`, 14, 45);
    doc.text(`Student ID: STU-${student.id.padStart(5, '0')}`, 14, 52);
    doc.text(`Email Address: ${student.email}`, 14, 59);
    doc.text(`Enrolled Course: ${student.coarse}`, 105, 45);
    doc.text(`Current Status: ${student.status}`, 105, 52);
    doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 105, 59);

    // Academic Performance Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 58, 138);
    doc.text("ACADEMIC PERFORMANCE", 14, 75);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`Cumulative GPA: ${student.gpa.toFixed(1)}`, 14, 82);
    doc.text(`Tuition Status: ${student.tuition}`, 105, 82);

    // Coursework Table
    autoTable(doc, {
      startY: 90,
      head: [['Course Name', 'Credits', 'Grade']],
      body: subjects.map(sub => [sub.name, sub.credits || '3.0', sub.grade]),
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], textColor: 255 },
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 5 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { top: 10 }
    });
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text("*** END OF OFFICIAL TRANSCRIPT ***", 105, pageHeight - 20, { align: "center" });
    doc.text("This document is generated automatically and does not require a signature.", 105, pageHeight - 15, { align: "center" });
    
    doc.save(`${student.name.replace(/\s+/g, '_')}_Transcript.pdf`);
    setActiveMenuId(null);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const newStudent = {
      id: Date.now().toString(),
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      coarse: String(data.get("coarse") ?? ""),
      status: "Active",
      gpa: parseFloat(data.get("gpa") ?? "0.0"),
      tuition: String(data.get("tuition") ?? "Pending"),
      joined: new Date().toISOString().split("T")[0],
      courses: [...modalCourses],
    };
    setStudents((prev) => [newStudent, ...prev]);
    setShowAddModal(false);
    form.reset();
  };

  const handleEditOpen = (student) => {
    setEditId(student.id);
    setEditStudent(student);
    setModalCourses(student.courses && student.courses.length > 0 ? [...student.courses] : [{ name: "", credits: 3.0, grade: "A" }]);
    setShowEditModal(true);
  };

  const handleEditSave = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStudents((prev) =>
      prev.map((s) =>
        s.id === editId
          ? { 
              ...s, 
              name: String(data.get("name") ?? ""), 
              email: String(data.get("email") ?? ""), 
              coarse: String(data.get("coarse") ?? ""),
              gpa: parseFloat(data.get("gpa") ?? "0.0"),
              tuition: String(data.get("tuition") ?? "Pending"),
              courses: [...modalCourses]
            }
          : s
      )
    );
    setShowEditModal(false);
    setEditId(null);
    setEditStudent(null);
  };

  const handleExportList = () => {
    const doc = new jsPDF('landscape');
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 58, 138); // Blue-900
    doc.text("Prime Board University", 14, 22);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text("ACADEMIC ENROLLMENT REPORT", 14, 30);
    
    // Separator line
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.line(14, 35, 283, 35);
    
    // Summary Stats
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42); // Slate-900
    
    doc.text(`Total Enrolled: ${stats.total}`, 14, 45);
    doc.text(`Average GPA: ${stats.avgGpa}`, 100, 45);
    doc.text(`Pending Tuition: ${stats.pendingTuition}`, 180, 45);
    doc.text(`Date Exported: ${new Date().toLocaleDateString()}`, 240, 45);

    // Export Table
    autoTable(doc, {
      startY: 55,
      head: [['Student ID', 'Full Name', 'Email Address', 'Enrolled Course', 'GPA', 'Tuition', 'Status']],
      body: students.map(s => [
        `STU-${s.id.padStart(5, '0')}`,
        s.name,
        s.email,
        s.coarse,
        s.gpa.toFixed(1),
        s.tuition,
        s.status.toUpperCase()
      ]),
      theme: 'grid',
      headStyles: { fillColor: [30, 58, 138], textColor: 255, halign: 'left' },
      styles: { font: 'helvetica', fontSize: 10, cellPadding: 5 },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text("Automated System Export - Confidential Academic Data", 148, pageHeight - 15, { align: "center" });
    
    doc.save("Students_Enrollment_Report.pdf");
  };

  const handleDeleteConfirm = () => {
    setStudents((prev) => prev.filter((s) => s.id !== deleteId));
    setDeleteId(null);
  };

  const stats = {
    total: students.length,
    avgGpa: students.length > 0 ? (students.reduce((acc, s) => acc + s.gpa, 0) / students.length).toFixed(1) : "0.0",
    pendingTuition: students.filter(s => s.tuition === 'Pending').length
  };

  const filtered = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.coarse.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = selectedTab === 'All' || s.status === selectedTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="text-slate-900 dark:text-slate-200">
      <style>{`
        @media print {
          .no-print, nav, aside, footer, button, .modal-backdrop, .search-container, .tabs-container { display: none !important; }
          .print-only { display: block !important; width: 100% !important; }
          body { background: white !important; color: black !important; margin: 0 !important; padding: 1.5cm !important; }
          .pdf-table { width: 100% !important; border-collapse: collapse !important; margin-top: 20px !important; }
          .pdf-table th { background-color: #f3f4f6 !important; color: #374151 !important; text-align: left !important; padding: 10px !important; border: 1px solid #e5e7eb !important; font-size: 11px !important; text-transform: uppercase !important; }
          .pdf-table td { padding: 10px !important; border: 1px solid #e5e7eb !important; font-size: 10px !important; }
          .pdf-header { border-bottom: 2px solid #000 !important; margin-bottom: 20px !important; padding-bottom: 10px !important; }
        }
        .print-only { display: none; }
      `}</style>

      <div className="no-print max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Students</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage academic records and enrollment status.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExportList} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 transition-all text-sm font-medium">
              <Download size={18} /> Export List
            </button>
            <button onClick={openAddModal} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all text-sm font-medium">
              <Plus size={18} /> Add Student
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/10 text-blue-600 rounded-xl"><GraduationCap size={24} /></div>
              <div><p className="text-xs font-semibold text-slate-500 uppercase">Total Enrolled</p><h3 className="text-2xl font-bold">{stats.total}</h3></div>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 rounded-xl"><BookOpen size={24} /></div>
              <div><p className="text-xs font-semibold text-slate-500 uppercase">Average GPA</p><h3 className="text-2xl font-bold">{stats.avgGpa}</h3></div>
            </div>
          </div>
          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-500/10 text-amber-600 rounded-xl"><AlertTriangle size={24} /></div>
              <div><p className="text-xs font-semibold text-slate-500 uppercase">Pending Tuition</p><h3 className="text-2xl font-bold">{stats.pendingTuition}</h3></div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-700/50 overflow-hidden bg-white dark:bg-slate-900 shadow-sm mb-8">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/20 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative search-container w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search name, email, or course..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="pl-10 pr-4 py-2 w-full lg:w-80 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all text-slate-700 dark:text-slate-200 placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2 tabs-container overflow-x-auto pb-1 lg:pb-0">
              {['All', 'Active', 'Inactive'].map((tab) => (
                <button key={tab} onClick={() => setSelectedTab(tab)} className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedTab === tab ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700/50">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">GPA</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tuition</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{student.name}</p>
                          <p className="text-xs text-slate-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <GraduationCap size={16} className="text-slate-400" />
                        {student.coarse}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                        student.gpa >= 3.5 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' :
                        student.gpa >= 3.0 ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                      }`}>
                        {student.gpa.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                        student.tuition === 'Paid' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10' : 'text-amber-600 bg-amber-50 dark:bg-amber-500/10'
                      }`}>
                        {student.tuition}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        student.status === 'Active' 
                          ? 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                          : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                      }`}>
                        {student.status === 'Active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button 
                        onClick={() => setActiveMenuId(activeMenuId === student.id ? null : student.id)} 
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {activeMenuId === student.id && (
                        <div className="absolute right-6 mt-1 w-40 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-xl z-50 text-left py-1.5 overflow-hidden">
                          <button 
                            onClick={() => handleDownloadTranscript(student)} 
                            className="w-full px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            <Download size={12}/> Download Transcript
                          </button>
                          <button 
                            onClick={() => { setActiveMenuId(null); handleEditOpen(student); }} 
                            className="w-full px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                          >
                            <Edit2 size={12}/> Edit Details
                          </button>
                          <button 
                            onClick={() => toggleStatus(student.id)} 
                            className="w-full px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                          >
                             {student.status === 'Active' ? <UserX size={12}/> : <UserCheck size={12}/>} Change Status
                          </button>
                          <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                          <button 
                            onClick={() => { setActiveMenuId(null); setDeleteId(student.id); }} 
                            className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"
                          >
                            <Trash2 size={12}/> Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center gap-2">
                        <Search size={24} className="text-slate-400 opacity-50" />
                        <p className="text-sm">No students found matching "{searchQuery}"</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">Add New Student</h2>
            <p className="text-sm text-slate-500 mb-6">Enter the academic and contact details.</p>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Full Name</label>
                <input name="name" required placeholder="e.g. Jane Doe" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Email Address</label>
                <input name="email" required type="email" placeholder="jane@example.com" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Enrolled Course</label>
                <input name="coarse" required placeholder="e.g. Computer Science" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all text-slate-900 dark:text-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">GPA</label>
                  <input name="gpa" type="number" step="0.1" min="0" max="4.0" required placeholder="e.g. 3.5" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all text-slate-900 dark:text-slate-100" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Tuition</label>
                  <select name="tuition" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all text-slate-900 dark:text-slate-100">
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Courses (Max 10)</label>
                  {modalCourses.length < 10 && (
                    <button type="button" onClick={() => setModalCourses([...modalCourses, { name: "", credits: 3.0, grade: "A" }])} className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">
                      + Add Course
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {modalCourses.map((c, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={c.name} onChange={e => updateCourse(i, 'name', e.target.value)} placeholder="Course name" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-xs transition-all dark:text-slate-200" required />
                      <input type="number" step="0.5" value={c.credits} onChange={e => updateCourse(i, 'credits', parseFloat(e.target.value))} placeholder="Cr." className="w-16 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-xs transition-all dark:text-slate-200" required />
                      <input value={c.grade} onChange={e => updateCourse(i, 'grade', e.target.value)} placeholder="Gr." className="w-16 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-xs transition-all dark:text-slate-200" required />
                      <button type="button" onClick={() => setModalCourses(modalCourses.filter((_, idx) => idx !== i))} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"><XCircle size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all font-medium text-sm">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">Edit Student</h2>
            <p className="text-sm text-slate-500 mb-6">Update academic and contact details.</p>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Full Name</label>
                <input name="name" required defaultValue={editStudent.name} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Email Address</label>
                <input name="email" required type="email" defaultValue={editStudent.email} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Enrolled Course</label>
                <input name="coarse" required defaultValue={editStudent.coarse} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all text-slate-900 dark:text-slate-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">GPA</label>
                  <input name="gpa" type="number" step="0.1" min="0" max="4.0" required defaultValue={editStudent.gpa} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all text-slate-900 dark:text-slate-100" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Tuition</label>
                  <select name="tuition" defaultValue={editStudent.tuition} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-sm transition-all text-slate-900 dark:text-slate-100">
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">Courses (Max 10)</label>
                  {modalCourses.length < 10 && (
                    <button type="button" onClick={() => setModalCourses([...modalCourses, { name: "", credits: 3.0, grade: "A" }])} className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline">
                      + Add Course
                    </button>
                  )}
                </div>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {modalCourses.map((c, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input value={c.name} onChange={e => updateCourse(i, 'name', e.target.value)} placeholder="Course name" className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-xs transition-all dark:text-slate-200" required />
                      <input type="number" step="0.5" value={c.credits} onChange={e => updateCourse(i, 'credits', parseFloat(e.target.value))} placeholder="Cr." className="w-16 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-xs transition-all dark:text-slate-200" required />
                      <input value={c.grade} onChange={e => updateCourse(i, 'grade', e.target.value)} placeholder="Gr." className="w-16 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500/20 outline-none text-xs transition-all dark:text-slate-200" required />
                      <button type="button" onClick={() => setModalCourses(modalCourses.filter((_, idx) => idx !== i))} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-1.5 rounded-lg transition-colors"><XCircle size={14}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm">Cancel</button>
                <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all font-medium text-sm">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle size={24} />
            </div>
            <h2 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Delete Student?</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">This action cannot be undone. All academic records associated with this student will be permanently removed.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-medium text-sm">Cancel</button>
              <button onClick={handleDeleteConfirm} className="flex-1 px-4 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-md shadow-red-500/20 transition-all font-medium text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
