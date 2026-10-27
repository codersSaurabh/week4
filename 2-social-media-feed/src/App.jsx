import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Zap, Send } from 'lucide-react';

const MOCK_USERS = [
  { id: 'u1', name: 'Alex Rivers', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80' },
  { id: 'u2', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80' }
];

const INITIAL_POSTS = [
  {
    id: 'p1',
    author: MOCK_USERS[0],
    content: 'Just deployed our new real-time WebSocket feed module! Check out how smooth state sync operates 🚀 #webdev #react',
    likes: 18,
    comments: [{ id: 'c1', author: 'Sarah Chen', text: 'Super clean architecture!' }]
  }
];

export default function App() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPostText, setNewPostText] = useState('');
  const [wsLive, setWsLive] = useState(false);

  useEffect(() => {
    if (!wsLive) return;
    const interval = setInterval(() => {
      const incoming = {
        id: 'ws_' + Date.now(),
        author: MOCK_USERS[1],
        content: '⚡ Live WebSocket Stream: New community update posted automatically!',
        likes: Math.floor(Math.random() * 5),
        comments: []
      };
      setPosts(prev => [incoming, ...prev]);
    }, 5000);
    return () => clearInterval(interval);
  }, [wsLive]);

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    const created = {
      id: 'post_' + Date.now(),
      author: MOCK_USERS[0],
      content: newPostText,
      likes: 0,
      comments: []
    };
    setPosts([created, ...posts]);
    setNewPostText('');
  };

  const toggleLike = (id) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
        <h1 className="text-xl font-bold text-purple-400 flex items-center gap-2">📱 DevSocial Feed</h1>
        <button 
          onClick={() => setWsLive(!wsLive)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition ${wsLive ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'}`}
        >
          <Zap className="w-3.5 h-3.5" /> WebSocket Stream: {wsLive ? 'LIVE' : 'OFF'}
        </button>
      </header>

      <form onSubmit={handleCreatePost} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6 space-y-3">
        <textarea
          rows={3}
          value={newPostText}
          onChange={(e) => setNewPostText(e.target.value)}
          placeholder="What's on your developer mind?"
          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs outline-none focus:border-purple-500"
        />
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" /> Post
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {posts.map(p => (
          <div key={p.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <img src={p.author.avatar} className="w-8 h-8 rounded-full object-cover" alt={p.author.name} />
              <span className="font-bold text-slate-200">{p.author.name}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{p.content}</p>
            <div className="flex items-center gap-4 pt-2 border-t border-slate-800/60 text-slate-400">
              <button onClick={() => toggleLike(p.id)} className="flex items-center gap-1 hover:text-red-400">
                <Heart className="w-4 h-4 text-red-500" /> <span>{p.likes}</span>
              </button>
              <span className="flex items-center gap-1"><MessageSquare className="w-4 h-4" /> {p.comments.length}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
