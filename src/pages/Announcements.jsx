import { useState } from "react";
import { Megaphone, Plus, Bell, Pin, Clock, Trash2, X, Edit, CheckCircle } from "lucide-react";

const categoryColors = {
  System:   "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Academic: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Update:   "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  General:  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Event:    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const initialAnnouncements = [
  { id: 1, title: "System Maintenance Scheduled", content: "The PrimeBoard servers will undergo scheduled maintenance this Sunday from 2 AM to 4 AM EST. Please ensure all critical work is saved before then.", date: new Date().toISOString(), author: "IT Support", pinned: true, category: "System" },
  { id: 2, title: "New Feature: Student Toolkit", content: "We've added 16 tools to the Student Toolkit including GPA Calculator, Pomodoro Timer, Flashcard Maker, Exam Countdown and more. Check it out under Tools.", date: new Date(Date.now() - 3600*1000*5).toISOString(), author: "Product Team", pinned: false, category: "Update" },
  { id: 3, title: "Final Exam Schedules Posted", content: "The schedules for the upcoming final exams have been published in the portal. Please review your dashboard for full details and contact your registrar with questions.", date: new Date(Date.now() - 86400*1000*2).toISOString(), author: "Registrar", pinned: false, category: "Academic" },
];

const formatDate = (iso) => {
  const now = new Date();
  const date = new Date(iso);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const emptyForm = { title: "", category: "General", content: "", author: "", pinned: false };

export default function Announcements() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState("All");

  const categories = ["All", "General", "System", "Academic", "Update", "Event"];

  const filtered = filter === "All" ? announcements : announcements.filter(a => a.category === filter);
  const pinned = filtered.filter(a => a.pinned);
  const unpinned = filtered.filter(a => !a.pinned);
  const sorted = [...pinned, ...unpinned];

  const openCreate = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (a) => { setForm({ title: a.title, category: a.category, content: a.content, author: a.author, pinned: a.pinned }); setEditId(a.id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditId(null); setForm(emptyForm); };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    if (editId) {
      setAnnouncements(announcements.map(a => a.id === editId ? { ...a, ...form } : a));
    } else {
      setAnnouncements([
        { id: Date.now(), ...form, author: form.author || "Admin", date: new Date().toISOString() },
        ...announcements,
      ]);
    }
    closeModal();
  };

  const handleDelete = (id) => { setAnnouncements(announcements.filter(a => a.id !== id)); setDeleteId(null); };
  const togglePin = (id) => setAnnouncements(announcements.map(a => a.id === id ? { ...a, pinned: !a.pinned } : a));

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <Megaphone size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Announcements</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Stay updated with the latest news and alerts.</p>
          </div>
        </div>
        <button onClick={openCreate} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-sm font-semibold active:scale-95">
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total", value: announcements.length, icon: Bell, color: "blue" },
          { label: "Pinned", value: announcements.filter(a => a.pinned).length, icon: Pin, color: "amber" },
          { label: "This Week", value: announcements.filter(a => (Date.now() - new Date(a.date)) < 604800000).length, icon: Clock, color: "emerald" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className={`p-3 rounded-xl ${color==="blue"?"bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400":color==="amber"?"bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400":"bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"}`}>
              <Icon size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">{label}</p>
              <p className="text-2xl font-black text-slate-800 dark:text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${filter===c?"bg-indigo-600 text-white shadow-md shadow-indigo-500/20":"bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-indigo-300"}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Announcements list */}
      <div className="space-y-4">
        {sorted.length === 0 && (
          <div className="text-center py-16">
            <Megaphone size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No announcements yet.</p>
          </div>
        )}
        {sorted.map((a) => (
          <div key={a.id} className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-700 relative overflow-hidden hover:border-indigo-300 dark:hover:border-indigo-600 transition-all group">
            {a.pinned && (
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl flex items-center gap-1">
                <Pin size={10} /> Pinned
              </div>
            )}
            <div className="flex items-start justify-between gap-4 mb-3 pr-16">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${categoryColors[a.category] || categoryColors.General}`}>
                    {a.category}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={11} /> {formatDate(a.date)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{a.title}</h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">{a.content}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-[10px] text-white font-bold">
                  {a.author.charAt(0)}
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{a.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => togglePin(a.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${a.pinned?"bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20":"text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
                  <Pin size={12} /> {a.pinned ? "Unpin" : "Pin"}
                </button>
                <button onClick={() => openEdit(a)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                  <Edit size={12} /> Edit
                </button>
                <button onClick={() => setDeleteId(a.id)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <h3 className="font-bold text-lg dark:text-white">{editId ? "Edit Announcement" : "Create Announcement"}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Title *</label>
                <input value={form.title} onChange={e => setForm({...form, title: e.target.value})} type="text" placeholder="Announcement title" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/30 outline-none dark:text-white" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/30 outline-none dark:text-white">
                    {["General","System","Academic","Update","Event"].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Author</label>
                  <input value={form.author} onChange={e => setForm({...form, author: e.target.value})} type="text" placeholder="e.g. Admin" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/30 outline-none dark:text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Message *</label>
                <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={4} placeholder="Write your announcement here..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500/30 outline-none resize-none dark:text-white" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.pinned} onChange={e => setForm({...form, pinned: e.target.checked})} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Pin this announcement to top</span>
              </label>
            </div>
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-3 bg-slate-50 dark:bg-slate-800/50">
              <button onClick={closeModal} className="flex-1 py-2.5 rounded-xl text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">Cancel</button>
              <button onClick={handleSubmit} disabled={!form.title.trim() || !form.content.trim()}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2">
                <CheckCircle size={15} /> {editId ? "Save Changes" : "Publish Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
              <Trash2 size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Delete Announcement?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold shadow-lg shadow-red-500/20 transition-all active:scale-95">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}