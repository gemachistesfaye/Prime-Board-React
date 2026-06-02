import React, { useState } from 'react';
import { PenTool } from 'lucide-react';

// Simple utility to generate a unique id (timestamp‑based)
const generateId = () => Date.now().toString();

export default function Posts() {
  const [message, setMessage] = useState('');
  const [posts, setPosts] = useState([]);

  const handleAdd = () => {
    if (!message.trim()) return;
    const newPost = {
      id: generateId(),
      text: message.trim(),
      createdAt: new Date(),
    };
    setPosts([newPost, ...posts]);
    setMessage('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <PenTool size={24} className="text-indigo-600 dark:text-indigo-300" />
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Posts
        </h1>
      </div>

      {/* Input area */}
      <div className="glass-card p-4 flex flex-col gap-3">
        <textarea
          rows={3}
          placeholder="Write something..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/10 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
        />
        <button
          onClick={handleAdd}
          className="self-end px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all active:scale-95"
        >
          Post
        </button>
      </div>

      {/* List of posts */}
      <div className="space-y-4">
        {posts.map((p) => (
          <div key={p.id} className="glass-card p-4">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{p.text}</p>
            <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
              {p.createdAt.toLocaleString()}
            </span>
          </div>
        ))}
        {posts.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400">No posts yet. Start the conversation!</p>
        )}
      </div>
    </div>
  );
}
