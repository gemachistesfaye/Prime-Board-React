import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from '../components/Layout/Layout';
import { 
  Search, Download, PlaneTakeoff, CheckCircle2, XCircle, Trash2,
  UserCheck, UserX, Edit2, ChevronLeft, ChevronRight, AlertTriangle,
  Plus, Mail, Calendar, Plane, MoreVertical
} from 'lucide-react';

export default function Booking() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [selectedTab, setSelectedTab] = useState('All');
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [bookings, setBookings] = useState([
    { id: "BK001", passenger: "Alex Johnson", email: "alex.j@example.com", status: "Confirmed", flight: "ET302", date: "Oct 12, 2024" },
    { id: "BK002", passenger: "Sarah Williams", email: "sarah.w@example.com", status: "Confirmed", flight: "ET118", date: "Nov 05, 2024" },
    { id: "BK003", passenger: "Michael Chen", email: "m.chen@example.com", status: "Cancelled", flight: "SQ421", date: "Sep 20, 2024" },
    { id: "BK004", passenger: "Emily Davis", email: "emily.d@example.com", status: "Confirmed", flight: "IB625", date: "Jan 15, 2025" },
    { id: "BK005", passenger: "Jordan Smith", email: "j.smith@example.com", status: "Confirmed", flight: "BA227", date: "Feb 02, 2025" },
    { id: "BK006", passenger: "David Miller", email: "d.miller@example.com", status: "Confirmed", flight: "TK042", date: "Mar 10, 2025" },
    { id: "BK007", passenger: "Jessica Taylor", email: "j.taylor@example.com", status: "Pending", flight: "JL001", date: "Dec 22, 2024" },
    { id: "BK008", passenger: "Kevin Brown", email: "k.brown@example.com", status: "Confirmed", flight: "LH400", date: "Jan 05, 2025" },
  ]);

  const stats = useMemo(() => ({
    total: bookings.length,
    confirmed: bookings.filter(s => s.status === 'Confirmed').length,
    cancelled: bookings.filter(s => s.status === 'Cancelled').length,
  }), [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = booking.passenger.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            booking.flight.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = selectedTab === 'All' || booking.status === selectedTab;
      return matchesSearch && matchesTab;
    });
  }, [bookings, searchTerm, selectedTab]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const currentItems = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedTab]);

  const handleDelete = () => {
    setBookings(prev => prev.filter(s => s.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  const handleEdit = (booking) => {
    setEditingBooking(booking);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const toggleStatus = (id) => {
    setBookings(prev => prev.map(s => {
      if (s.id === id) {
        const nextStatus = s.status === 'Confirmed' ? 'Cancelled' : 'Confirmed';
        return { ...s, status: nextStatus };
      }
      return s;
    }));
    setActiveMenuId(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      passenger: formData.get('passenger') || '',
      email: formData.get('email') || '',
      flight: formData.get('flight') || '',
      date: formData.get('date') || '',
      status: formData.get('status') || 'Confirmed',
    };

    if (editingBooking) {
      setBookings(prev => prev.map(b => (b.id === editingBooking.id ? { ...b, ...data } : b)));
    } else {
      const newBooking = { id: `BK${Math.floor(1000 + Math.random() * 9000)}`, ...data };
      setBookings([newBooking, ...bookings]);
    }
    setIsModalOpen(false);
    setEditingBooking(null);
  };

  return ( 
    <Layout>
    <div className="min-h-screen p-4 sm:p-6 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-200">
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Flight Bookings</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage global travel manifests and passenger status.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 transition-all text-sm font-medium">
              <Download size={18} /> Export Manifest
            </button>
            <button onClick={() => { setEditingBooking(null); setIsModalOpen(true); }} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition-all text-sm font-medium">
              <Plus size={18} /> Add Booking
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-500/10 text-blue-600 rounded-xl"><PlaneTakeoff size={24} /></div>
              <div><p className="text-xs font-semibold text-slate-500 uppercase">Total Passengers</p><h3 className="text-2xl font-bold">{stats.total}</h3></div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 rounded-xl"><CheckCircle2 size={24} /></div>
              <div><p className="text-xs font-semibold text-slate-500 uppercase">Confirmed</p><h3 className="text-2xl font-bold">{stats.confirmed}</h3></div>
            </div>
          </div>
          <div className="glass-card p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-100 dark:bg-rose-500/10 text-rose-600 rounded-xl"><XCircle size={24} /></div>
              <div><p className="text-xs font-semibold text-slate-500 uppercase">Cancelled</p><h3 className="text-2xl font-bold">{stats.cancelled}</h3></div>
            </div>
          </div>
        </div>

        <div className="glass-card overflow-hidden mb-8">
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative search-container w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search name, email, or flight..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 pr-4 py-2 w-full lg:w-80 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 outline-none text-sm" />
            </div>
            <div className="flex items-center gap-2 tabs-container overflow-x-auto pb-1 lg:pb-0">
              {['All', 'Confirmed', 'Pending', 'Cancelled'].map((tab) => (
                <button key={tab} onClick={() => setSelectedTab(tab)} className={`px-4 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${selectedTab === tab ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="px-6 py-4">Passenger</th>
                  <th className="px-6 py-4">Flight Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {currentItems.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-xs">{booking.passenger.charAt(0)}</div>
                        <div>
                          <p className="font-semibold text-sm">{booking.passenger}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1"><Mail size={10}/> {booking.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium flex items-center gap-2"><Plane size={14} className="text-slate-400"/> {booking.flight}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1"><Calendar size={12}/> {booking.date}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase inline-flex items-center gap-1 ${
                        booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-500' : 
                        booking.status === 'Cancelled' ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-500' :
                        'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-500'
                      }`}>
                        {booking.status === 'Confirmed' ? <CheckCircle2 size={10}/> : booking.status === 'Cancelled' ? <XCircle size={10}/> : <AlertTriangle size={10}/>}
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <button onClick={() => setActiveMenuId(activeMenuId === booking.id ? null : booking.id)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                        <MoreVertical size={16} />
                      </button>
                      {activeMenuId === booking.id && (
                        <div className="absolute right-6 mt-1 w-36 bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 rounded-xl z-50 text-left py-1.5 overflow-hidden">
                          <button onClick={() => handleEdit(booking)} className="w-full px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"><Edit2 size={12}/> Edit Details</button>
                          <button onClick={() => toggleStatus(booking.id)} className="w-full px-4 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2">
                             {booking.status === 'Confirmed' ? <UserX size={12}/> : <UserCheck size={12}/>} Change Status
                          </button>
                          <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                          <button onClick={() => setConfirmDeleteId(booking.id)} className="w-full px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"><Trash2 size={12}/> Remove</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/10">
            <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Page {currentPage} of {totalPages}</span>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1.5 border dark:border-slate-700 rounded-lg disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-colors"><ChevronLeft size={16}/></button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1.5 border dark:border-slate-700 rounded-lg disabled:opacity-30 hover:bg-white dark:hover:bg-slate-800 transition-colors"><ChevronRight size={16}/></button>
            </div>
          </div>
        </div>
      </div>

      <div className="print-only">
        <div className="pdf-header">
          <h1 className="text-xl font-bold uppercase">Passenger Manifest Report</h1>
          <p className="text-[10px]">Reference: FLIGHT-EX-992 | Date: {new Date().toLocaleDateString()}</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="border border-gray-300 p-2 text-center text-[10px]"><strong>Total Capacity:</strong> {stats.total}</div>
          <div className="border border-gray-300 p-2 text-center text-[10px]"><strong>Confirmed Seats:</strong> {stats.confirmed}</div>
          <div className="border border-gray-300 p-2 text-center text-[10px]"><strong>Cancellations:</strong> {stats.cancelled}</div>
        </div>
        <table className="pdf-table">
          <thead><tr><th>Manifest ID</th><th>Passenger Name</th><th>Email</th><th>Flight No.</th><th>Status</th><th>Travel Date</th></tr></thead>
          <tbody>
            {bookings.map((s) => (
              <tr key={s.id}><td>{s.id}</td><td><strong>{s.passenger}</strong></td><td>{s.email}</td><td>{s.flight}</td><td className="uppercase">{s.status}</td><td>{s.date}</td></tr>
            ))}
          </tbody>
        </table>
        <div className="mt-12 pt-4 border-t border-gray-200 text-[8px] text-gray-400 text-center">Automated System Export - Confidential Flight Data - Page 1 of 1</div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
          <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-bold mb-6 dark:text-white">{editingBooking ? 'Edit Booking' : 'Add New Booking'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Passenger Name</label><input name="passenger" defaultValue={editingBooking?.passenger} required className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" /></div>
              <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Email Address</label><input name="email" type="email" defaultValue={editingBooking?.email} required className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Flight Code</label><input name="flight" defaultValue={editingBooking?.flight} required className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm" /></div>
                <div><label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Date</label><input name="date" placeholder="Oct 12, 2024" defaultValue={editingBooking?.date} required className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 text-sm" /></div>
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 border dark:border-slate-700 rounded-xl text-sm font-semibold transition-colors hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-blue-500/30 transition-all">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm no-print">
          <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-2xl p-6 shadow-2xl border-rose-100 dark:border-rose-900/30 border">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center mb-4"><AlertTriangle size={24} /></div>
            <h3 className="text-lg font-bold mb-2 dark:text-white">Delete Booking?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This will permanently remove the passenger from the flight manifest. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDeleteId(null)} className="flex-1 py-2 rounded-xl border dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700">Keep It</button>
              <button onClick={handleDelete} className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-medium shadow-lg shadow-rose-500/30">Delete Forever</button>
            </div>
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
}
