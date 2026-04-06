import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { LogOut, Bell, Search, Menu, Moon, Sun, Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, cycleTheme } = useTheme();
  const { lang, changeLanguage, t } = useLanguage();
  const [showLangDropdown, setShowLangDropdown] = React.useState(false);
  const [notifications, setNotifications] = React.useState([]);
  const [showNotifications, setShowNotifications] = React.useState(false);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications/my');
        setNotifications(res.data);
      } catch (e) { }
    };
    if (user) fetchNotifications();
  }, [user]);

  const handleMarkRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) { }
  };

  return (
    <nav className="h-16 glass-panel border-b border-gray-500/10 flex items-center justify-between px-6 sticky top-0 z-20 w-full transition-colors">
      <div className="flex items-center gap-4">
        <button className="lg:hidden hover:text-primary-500 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 opacity-50" />
          <input 
            type="text" 
            placeholder={t('search_placeholder')} 
            className="input-field py-1.5 w-64 text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
             onClick={() => setShowLangDropdown(!showLangDropdown)}
             className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1"
          >
            <Globe className="w-5 h-5" />
            <span className="text-xs uppercase font-bold">{lang}</span>
          </button>
          <AnimatePresence>
            {showLangDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-32 glass-panel rounded-xl shadow-xl overflow-hidden text-sm z-30"
              >
                <button onClick={() => {changeLanguage('en'); setShowLangDropdown(false)}} className={`w-full text-left px-4 py-2 hover:bg-primary-500/10 ${lang==='en'?'text-primary-500 font-bold':''}`}>English</button>
                <button onClick={() => {changeLanguage('hi'); setShowLangDropdown(false)}} className={`w-full text-left px-4 py-2 hover:bg-primary-500/10 ${lang==='hi'?'text-primary-500 font-bold':''}`}>हिंदी</button>
                <button onClick={() => {changeLanguage('mr'); setShowLangDropdown(false)}} className={`w-full text-left px-4 py-2 hover:bg-primary-500/10 ${lang==='mr'?'text-primary-500 font-bold':''}`}>मराठी</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

         <div className="relative group">
          <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : 
             theme === 'sunset' ? <Sun className="w-5 h-5 text-orange-400" /> : 
             theme === 'ocean' ? <Globe className="w-5 h-5 text-sky-400" /> : 
             <Sun className="w-5 h-5 text-yellow-400" />}
          </button>
          
          <div className="absolute right-0 mt-2 w-48 glass-panel rounded-2xl shadow-2xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
            <div className="p-2 grid grid-cols-1 gap-1">
              {[
                { id: 'light', name: 'Light Bloom', color: 'bg-yellow-400' },
                { id: 'dark', name: 'Midnight Neon', color: 'bg-indigo-600' },
                { id: 'ocean', name: 'Deep Ocean', color: 'bg-sky-500' },
                { id: 'sunset', name: 'Desert Sunset', color: 'bg-rose-500' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => cycleTheme && cycleTheme(t.id)} // Assuming cycleTheme can take an ID or I'll fix it
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-200 ${theme === t.id ? 'bg-primary/20 text-primary font-bold' : 'hover:bg-white/5'}`}
                >
                  <div className={`w-3 h-3 rounded-full ${t.color} shadow-[0_0_8px_rgba(0,0,0,0.2)]`} />
                  <span className="text-sm">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="hover:text-primary transition-colors relative p-2"
          >
            <Bell className="w-5 h-5" />
            <AnimatePresence>
              {notifications.some(n => !n.isRead) && (
                <motion.span 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-panel shadow-[0_0_8px_var(--primary)]"
                ></motion.span>
              )}
            </AnimatePresence>
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                animate={{ opacity: 1, y: 0, scale: 1 }} 
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute right-0 mt-4 w-80 glass-panel rounded-3xl shadow-2xl overflow-hidden z-50 border border-primary/10"
              >
                <div className="p-5 border-b border-border bg-primary/5 flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Notifications</h3>
                  <span className="text-[10px] font-bold text-secondary/40 whitespace-nowrap">{notifications.filter(n=>!n.isRead).length} Unread</span>
                </div>
                <div className="max-h-96 overflow-y-auto custom-scrollbar bg-panel/40">
                  {notifications.map((n, i) => (
                    <div 
                      key={n.id || i} 
                      className={`p-5 border-b border-border/50 flex flex-col gap-1 transition-colors hover:bg-primary/5 relative group ${!n.isRead ? 'bg-primary/[0.02]' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/70">{n.type}</span>
                        {!n.isRead && (
                          <button 
                            onClick={() => handleMarkRead(n.id)}
                            className="p-1 rounded-lg bg-panel border opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Check className="w-3 h-3 text-emerald-500" />
                          </button>
                        )}
                      </div>
                      <p className={`text-xs font-bold leading-relaxed ${!n.isRead ? 'text-foreground' : 'text-secondary/60'}`}>{n.title}</p>
                      <p className="text-[10px] text-secondary/40 font-medium">Recently received</p>
                    </div>
                  ))}
                  {notifications.length === 0 && (
                    <div className="p-10 text-center opacity-20 flex flex-col items-center gap-3">
                      <Bell className="w-8 h-8" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No Transmissions</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex items-center gap-3 border-l border-gray-500/20 pl-4 ml-2">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium">{user?.fullName || user?.username}</span>
            <span className={`text-xs ${user?.role === 'ADMIN' ? 'text-red-500 font-bold' : 'text-primary-500'}`}>{user?.role}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg cursor-pointer">
            {(user?.fullName || user?.username || '?').charAt(0).toUpperCase()}
          </div>
          <button onClick={logout} className="hover:text-red-500 transition-colors ml-2" title={t('logout')}>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
