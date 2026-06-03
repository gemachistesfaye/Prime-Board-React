import { useState, useEffect, useRef } from "react";
import { PenTool, Save, X, Edit, Trash2, MessageSquare, Clock, AlertTriangle } from "lucide-react";
import { mockPosts } from "../data/mockPosts";

const generateId = () => Date.now().toString();

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

const MAX_CHARS = 500;

export default function Posts() {
  const [posts, setPosts] = useState(() => {
    try {
      const stored = localStorage.getItem("primeboard_posts");
      const parsed = JSON.parse(stored); return (parsed && parsed.length > 0) ? parsed : mockPosts;
    } catch {
      return mockPosts;
    }
  });

  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const textareaRef = useRef(null);

  // Persist on change
  useEffect(() => {
    localStorage.setItem("primeboard_posts", JSON.stringify(posts));
  }, [posts]);

  const handleAdd = () => {
    if (!message.trim() || message.length > MAX_CHARS) return;
    setPosts([
      {
        id: generateId(),
        text: message.trim(),
        createdAt: new Date().toISOString(),
      },
      ...posts,
    ]);
    setMessage("");
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAdd();
  };

  const startEdit = (post) => { setEditId(post.id); setEditText(post.text); };
  const cancelEdit = () => { setEditId(null); setEditText(""); };

  const handleUpdate = (id) => {
    if (!editText.trim()) return;
    setPosts(posts.map((p) => p.id === id ? { ...p, text: editText.trim(), editedAt: new Date().toISOString() } : p));
    cancelEdit();
  };

  const handleDelete = (id) => {
    setPosts(posts.filter((p) => p.id !== id));
    setDeleteId(null);
  };

  const handleClearAll = () => {
    setPosts([]);
    setShowClearConfirm(false);
  };

  const remaining = MAX_CHARS - message.length;

  return (
    <div className="w-full space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
            <PenTool size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Posts</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{posts.length} {posts.length === 1 ? "post" : "posts"}</p>
          </div>
        </div>
        {posts.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-200 dark:border-red-800"
          >
            <Trash2 size={13} /> Clear All
          </button>
        )}
      </div>

      {/* Compose box */}
      <div className="glass-card rounded-2xl p-4 space-y-3 border border-slate-200 dark:border-slate-700">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md shadow-indigo-500/20">
            GT
          </div>
          <textarea
            ref={textareaRef}
            rows={3}
            placeholder="Share an update, announcement or note... (Ctrl+Enter to post)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={MAX_CHARS}
            className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 border border-slate-200 dark:border-slate-700 text-sm resize-none transition-all"
          />
        </div>
        <div className="flex items-center justify-between pl-12">
          <span className={`text-xs font-medium ${remaining < 50 ? remaining < 20 ? "text-red-500" : "text-amber-500" : "text-slate-400"}`}>
            {remaining} characters remaining
          </span>
          <button
            onClick={handleAdd}
            disabled={!message.trim() || message.length > MAX_CHARS}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/20 transition-all active:scale-95"
          >
            Post
          </button>
        </div>
      </div>

      {/* Posts list */}
      <div className="space-y-3">
        {posts.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No posts yet.</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Be the first to share something!</p>
          </div>
        )}

        {posts.map((p) => (
          <div key={p.id} className="glass-card rounded-2xl p-4 border border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800 transition-all group">
            {editId === p.id ? (
              <div className="space-y-3">
                <textarea
                  rows={3}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.ctrlKey || e.metaKey) && handleUpdate(p.id)}
                  maxLength={MAX_CHARS}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-indigo-300 dark:border-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-sm resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => handleUpdate(p.id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors">
                    <Save size={13} /> Save
                  </button>
                  <button onClick={cancelEdit} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-lg transition-colors">
                    <X size={13} /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    GT
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">Gemachis T</span>
                      <span className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                        <Clock size={11} /> {formatDate(p.createdAt)}
                      </span>
                      {p.editedAt && <span className="text-xs text-slate-400 dark:text-slate-500 italic">(edited)</span>}
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{p.text}</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-3 pl-11 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startEdit(p)} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors">
                    <Edit size={12} /> Edit
                  </button>
                  <button onClick={() => setDeleteId(p.id)} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Delete confirm modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Delete Post?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold shadow-lg shadow-red-500/20 transition-all active:scale-95">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All confirm modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-200 dark:border-slate-700 text-center">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Clear All Posts?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">All {posts.length} posts will be permanently deleted.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowClearConfirm(false)} className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Cancel</button>
              <button onClick={handleClearAll} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold shadow-lg shadow-red-500/20 transition-all active:scale-95">Clear All</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}