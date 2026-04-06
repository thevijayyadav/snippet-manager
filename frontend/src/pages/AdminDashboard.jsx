import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Users, Activity, Trash2, Plus, X, UserPlus, Sparkles, Terminal, Mail, User, Type, KeyRound } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import userService from '../services/userService';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ fullName: '', username: '', email: '', password: '', confirmPassword: '', role: 'USER' });
  const [status, setStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (e) {
      setStatus({ type: 'error', message: 'Failed to load user database.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id, username) => {
    if (username === 'admin') return;
    if (window.confirm(`Are you sure you want to permanently delete user '${username}'?`)) {
      try {
        await userService.deleteUser(id);
        setStatus({ type: 'success', message: `User ${username} removed successfully.` });
        loadUsers();
      } catch (e) {
        setStatus({ type: 'error', message: 'Failed to remove user.' });
      }
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (newUser.password !== newUser.confirmPassword) {
       setStatus({ type: 'error', message: 'Passwords do not match!' });
       return;
    }

    try {
      await userService.createUser(newUser);
      setStatus({ type: 'success', message: `User ${newUser.username} onboarded successfully.` });
      setNewUser({ fullName: '', username: '', email: '', password: '', confirmPassword: '', role: 'USER' });
      setShowAddUser(false);
      loadUsers();
    } catch (e) {
      setStatus({ type: 'error', message: e.message || 'Failed to onboard new user.' });
    }
  };

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto pb-20 px-4"
    >
      {/* Premium Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 shadow-xl shadow-red-500/5">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight label-gradient leading-none">
                {t('admin_hub')}
              </h1>
              <p className="text-secondary font-bold text-sm tracking-wide uppercase mt-1 opacity-70">Control Tower & User Management</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4">
          {[
            { icon: Users, label: 'Active Users', val: users.length, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
            { icon: Activity, label: 'System Status', val: 'Operational', color: 'text-emerald-400', bg: 'bg-emerald-500/10' }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel px-6 py-4 rounded-[2rem] flex items-center gap-4 border-border/50 min-w-[200px]"
            >
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-inner`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-secondary/50">{stat.label}</div>
                <div className={`font-black text-xl tracking-tight ${stat.val === 'Operational' ? 'text-emerald-400 animate-pulse' : ''}`}>{stat.val}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {status.message && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }}
          className={`mb-8 p-4 rounded-2xl font-bold text-sm flex items-center gap-3 border ${
            status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${status.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'} animate-ping`}></div>
          {status.message}
        </motion.div>
      )}

      {/* Control Actions */}
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" /> Authority Registry
        </h3>
        <button 
          onClick={() => setShowAddUser(!showAddUser)}
          className={`btn-primary px-6 py-3 font-black shadow-3xl flex items-center gap-3 transition-colors ${showAddUser ? 'bg-panel !text-primary border-primary hover:bg-primary/10 hover:border-primary' : ''}`}
        >
          {showAddUser ? <X className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          {showAddUser ? 'Close Terminal' : 'Onboard User'}
        </button>
      </div>

      {/* Premium Add User Form */}
      <AnimatePresence>
        {showAddUser && (
          <motion.div 
            initial={{ height: 0, opacity: 0, y: -10 }} 
            animate={{ height: 'auto', opacity: 1, y: 0 }} 
            exit={{ height: 0, opacity: 0, y: -10 }} 
            className="overflow-hidden mb-10"
          >
            <form onSubmit={handleAddUser} className="glass-panel p-10 rounded-[3rem] border-primary/20 relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Users className="w-40 h-40" />
              </div>
              <h3 className="text-xl font-black mb-8 flex items-center gap-3"><Sparkles className="w-6 h-6 text-primary" /> Terminal Entry: New Entity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black ml-2 text-secondary/50 uppercase tracking-widest flex items-center gap-1.5"><Type className="w-3 h-3"/> Full Identity</label>
                  <input type="text" required placeholder="Full Name" value={newUser.fullName} onChange={e => setNewUser({...newUser, fullName: e.target.value})}
                    className="input-field text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black ml-2 text-secondary/50 uppercase tracking-widest flex items-center gap-1.5"><User className="w-3 h-3"/> Handle (Username)</label>
                  <input type="text" required placeholder="Username" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})}
                    className="input-field text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black ml-2 text-secondary/50 uppercase tracking-widest flex items-center gap-1.5"><Mail className="w-3 h-3"/> Comms Address (Email)</label>
                  <input type="email" required placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})}
                    className="input-field text-sm font-bold" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black ml-2 text-secondary/50 uppercase tracking-widest flex items-center gap-1.5"><KeyRound className="w-3 h-3"/> Secret Code</label>
                  <input type="password" required placeholder="••••••••" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})}
                    className="input-field text-sm font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black ml-2 text-secondary/50 uppercase tracking-widest flex items-center gap-1.5"><KeyRound className="w-3 h-3"/> Confirm Secret</label>
                  <input type="password" required placeholder="••••••••" value={newUser.confirmPassword} onChange={e => setNewUser({...newUser, confirmPassword: e.target.value})}
                    className="input-field text-sm font-bold" />
                </div>
                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black ml-2 text-secondary/50 uppercase tracking-widest flex items-center gap-1.5"><Shield className="w-3 h-3"/> Clearance</label>
                    <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}
                      className="input-field text-sm font-black text-primary bg-panel">
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                  <button type="submit" className="btn-primary p-3.5 shadow-2xl flex-shrink-0">
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Authority Table */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="glass-panel rounded-[3rem] overflow-hidden shadow-2xl border-border/50"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-primary/5 text-secondary">
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] border-b border-border/50">Identity Profile</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] border-b border-border/50">Handle & Comms</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] border-b border-border/50">Clearance</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] border-b border-border/50 text-center">Date Onboarded</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] border-b border-border/50 text-center">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr><td colSpan="5" className="p-20 text-center text-secondary font-black animate-pulse tracking-widest">SYNCHRONIZING ENTITY DATA...</td></tr>
              ) : users.map((u, idx) => {
                return (
                  <motion.tr 
                    key={u.id}
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    transition={{ delay: idx * 0.05 }}
                    className="group transition-all duration-300 hover:bg-primary/5"
                  >
                    <td className="p-8">
                      <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-black text-xl shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-6">
                          {(u.fullName || u.username || u.email || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-black text-lg tracking-tight group-hover:text-primary transition-colors">{u.fullName || 'Anonymous'}</div>
                          <div className="text-[9px] font-black text-secondary/40 font-mono tracking-widest pt-0.5">{u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-8">
                      <div className="font-mono text-xs font-bold text-primary mb-1">@{u.username}</div>
                      <div className="text-xs font-medium text-secondary">{u.email}</div>
                    </td>
                    <td className="p-8">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest ${
                        u.role === 'ADMIN' 
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20' 
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-8 text-center text-xs font-bold text-secondary">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-8 text-center">
                      <div className="flex items-center justify-center gap-3">
                        {u.role !== 'ADMIN' && (
                          <button onClick={() => handleDeleteUser(u.id, u.username)} 
                            className="btn-secondary p-3.5 text-red-500 hover:bg-red-500/10 hover:border-red-500/30" 
                            title="Revoke Permission">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
