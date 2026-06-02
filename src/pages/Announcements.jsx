import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, Clock, User, Plus, Edit2, Trash2, 
  CheckCircle2, XCircle, ChevronLeft, ChevronRight, BookOpen, UserPlus, MoreVertical
} from 'lucide-react';

export default function Booking() {
  const [appointments, setAppointments] = useState([
  { id: "APT-001", student: "Gemachis Tesfaye", type: "Academic Advising", date: "2024-10-15", time: "10:00 AM", status: "Upcoming", advisor: "Dr. Smith" },
    { id: "APT-002", student: "Bob Smith", type: "Tutoring (Math)", date: "2024-10-16", time: "02:30 PM", status: "Completed", advisor: "Prof. Davis" },
    { id: "APT-003", student: "Carol White", type: "Thesis Defense", date: "2024-10-20", time: "09:00 AM", status: "Upcoming", advisor: "Dr. Brown" },
    { id: "APT-004", student: "David Miller", type: "Course Registration", date: "2024-10-12", time: "11:15 AM", status: "Cancelled", advisor: "Dr. Smith" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingApt, setEditingApt] = useState(null);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const stats = {
    total: appointments.length,
    upcoming: appointments.filter(a => a.status === 'Upcoming').length,
    completed: appointments.filter(a => a.status === 'Completed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    
    if (editingApt) {
      setAppointments(appointments.map(a => 
        a.id === editingApt.id ? {
          ...a,
          student: data.get("student"),
          type: data.get("type"),
          date: data.get("date"),
          time: data.get("time"),
          advisor: data.get("advisor"),
        } : a
      ));
    } else {
      const newApt = {
        id: `APT-${Math.floor(100 + Math.random() * 900)}`,
        student: data.get("student"),
        type: data.get("type"),
        date: data.get("date"),
        time: data.get("time"),
        advisor: data.get("advisor"),
        status: "Upcoming"
      };
      setAppointments([newApt, ...appointments]);
    }
    setShowModal(false);
    setEditingApt(null);
  };

  const openReschedule = (apt) => {
    setEditingApt(apt);
    setShowModal(true);
    setActiveMenuId(null);
  };

  const cancelAppointment = (id) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status: 'Cancelled' } : a));
    setActiveMenuId(null);
  };

  const confirmDelete = () => {
    setAppointments(appointments.filter(a => a.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  return (
    <div className="text-slate-900 dark:text-slate-200 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Academic Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Schedule and manage student advising and academic meetings.</p>
        </div>
        <button onClick={() => { setEditingApt(null); setShowModal(true); }} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all text-sm font-medium">
          <Plus size={18} /> Schedule Appointment
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="glass-card p-6 flex items-center gap-4 rounded-2xl">
          <div className="p-3 bg-blue-100 dark:bg-blue-500/10 text-blue-600 rounded-xl"><CalendarIcon size={24} /></div>
          <div><p className="text-xs font-semibold text-slate-500 uppercase">Total Scheduled</p><h3 className="text-2xl font-bold">{stats.total}</h3></div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 rounded-2xl">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 rounded-xl"><Clock size={24} /></div>
          <div><p className="text-xs font-semibold text-slate-500 uppercase">Upcoming Meetings</p><h3 className="text-2xl font-bold">{stats.upcoming}</h3></div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 rounded-2xl">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 rounded-xl"><CheckCircle2 size={24} /></div>
          <div><p className="text-xs font-semibold text-slate-500 uppercase">Completed</p><h3 className="text-2xl font-bold">{stats.completed}</h3></div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4 rounded-2xl">
          <div className="p-3 bg-rose-100 dark:bg-rose-500/10 text-rose-600 rounded-xl"><XCircle size={24} /></div>
          <div><p className="text-xs font-semibold text-slate-500 uppercase">Cancelled</p><h3 className="text-2xl font-bold">{stats.cancelled}</h3></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">October 2024</h3>
              <div className="flex gap-2">
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><ChevronLeft size={18} /></button>
                <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"><ChevronRight size={18} /></button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 mb-2">
              <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {[...Array(31)].map((_, i) => (
                <div key={i} className={`p-2 rounded-lg ${i + 1 === 15 ? 'bg-blue-600 text-white font-bold shadow-md' : 'hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'}`}>
                  {i + 1}
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="font-semibold text-sm mb-3">Upcoming Today</h4>
              <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20">
                <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Academic Advising</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1 flex items-center gap-1"><Clock size={12}/> 10:00 AM with Gemachis Tesfaye</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="font-bold text-lg">Appointment Roster</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 font-bold">Student</th>
                    <th className="px-6 py-4 font-bold">Details</th>
                    <th className="px-6 py-4 font-bold">Date & Time</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {appointments.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xs">
                            {apt.student.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{apt.student}</p>
                            <p className="text-xs text-slate-500">{apt.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium flex items-center gap-1.5"><BookOpen size={14} className="text-slate-400" /> {apt.type}</p>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5"><User size={12} /> {apt.advisor}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium flex items-center gap-1.5"><CalendarIcon size={14} className="text-slate-400" /> {apt.date}</p>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5"><Clock size={12} /> {apt.time}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1.5 border ${
                          apt.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' :
                          apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' :
                          'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20'
                        }`}>
                          {apt.status === 'Upcoming' ? <Clock size={10} /> : apt.status === 'Completed' ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right relative">
                        <button onClick={() => setActiveMenuId(activeMenuId === apt.id ? null : apt.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                        {activeMenuId === apt.id && (
                          <div className="absolute right-6 mt-1 w-36 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-xl z-50 text-left py-1.5 overflow-hidden">
                            <button onClick={() => openReschedule(apt)} className="w-full px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"><Edit2 size={12}/> Reschedule</button>
                            <button onClick={() => cancelAppointment(apt.id)} className="w-full px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"><XCircle size={12}/> Cancel Meeting</button>
                            <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                            <button onClick={() => { setConfirmDeleteId(apt.id); setActiveMenuId(null); }} className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"><Trash2 size={12}/> Delete</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2"><UserPlus size={20}/> {editingApt ? 'Reschedule Appointment' : 'Schedule Appointment'}</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Student Name</label><input name="student" defaultValue={editingApt?.student} required className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" /></div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Meeting Type</label>
                <select name="type" defaultValue={editingApt?.type} required className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm outline-none">
                  <option>Academic Advising</option>
                  <option>Course Registration</option>
                  <option>Tutoring</option>
                  <option>Thesis Defense</option>
                  <option>Career Counseling</option>
                  <option>Financial Aid Meeting</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Advisor / Professor</label><input name="advisor" defaultValue={editingApt?.advisor} required className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Date</label><input type="date" name="date" defaultValue={editingApt?.date} required className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm [color-scheme:light] dark:[color-scheme:dark]" /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Time</label><input type="time" name="time" defaultValue={editingApt?.time} required className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm [color-scheme:light] dark:[color-scheme:dark]" /></div>
              </div>
              <div className="flex gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => { setShowModal(false); setEditingApt(null); }} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold transition-colors hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all">{editingApt ? 'Save Changes' : 'Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl border-rose-100 dark:border-rose-900/30 border">
            <h3 className="text-lg font-bold mb-2 dark:text-white">Delete Appointment?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This will permanently remove the appointment from the records. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-2 rounded-xl border dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Keep It</button>
              <button onClick={confirmDelete} className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-rose-500/30">Delete Forever</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
