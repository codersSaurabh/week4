import React, { useState, useEffect } from 'react';
import { Kanban, Plus, Shield } from 'lucide-react';

const INITIAL_TASKS = {
  't1': { id: 't1', title: 'Setup E-Commerce Cart Logic', status: 'To Do', priority: 'High' },
  't2': { id: 't2', title: 'Implement WebSocket Feed', status: 'In Progress', priority: 'Medium' },
  't3': { id: 't3', title: 'Kanban RBAC Authorization', status: 'Completed', priority: 'Urgent' }
};

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('pm_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [role, setRole] = useState('Admin');
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('pm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const canEdit = role !== 'Viewer';

  const moveTask = (id, newStatus) => {
    if (!canEdit) return;
    setTasks(prev => ({ ...prev, [id]: { ...prev[id], status: newStatus } }));
  };

  const addTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !canEdit) return;
    const id = 't_' + Date.now();
    setTasks(prev => ({ ...prev, [id]: { id, title: newTitle, status: 'To Do', priority: 'Medium' } }));
    setNewTitle('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
        <h1 className="text-xl font-bold text-indigo-400 flex items-center gap-2">📋 TaskPulse PM Dashboard</h1>
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
          <Shield className="w-4 h-4 text-amber-400" />
          <span>Role:</span>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="bg-transparent font-bold outline-none cursor-pointer">
            <option value="Admin">Admin</option>
            <option value="Project Manager">Project Manager</option>
            <option value="Team Member">Team Member</option>
            <option value="Viewer">Viewer (Read-Only)</option>
          </select>
        </div>
      </header>

      {canEdit && (
        <form onSubmit={addTask} className="flex gap-2 mb-6 max-w-md">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add new task card..."
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs outline-none"
          />
          <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-semibold">
            + Add Card
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['To Do', 'In Progress', 'Completed'].map(col => (
          <div key={col} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">{col}</h3>
            <div className="space-y-3">
              {Object.values(tasks).filter(t => t.status === col).map(t => (
                <div key={t.id} className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-xs space-y-2">
                  <h4 className="font-bold text-slate-200">{t.title}</h4>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-800/80">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold">{t.priority}</span>
                    {canEdit && (
                      <select 
                        value={t.status} 
                        onChange={(e) => moveTask(t.id, e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-[10px] rounded px-1.5 py-1"
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
