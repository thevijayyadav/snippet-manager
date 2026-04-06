import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { LayoutDashboard, PlusCircle, Library, Settings, Shield, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar() {
  const { user } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    ...(user?.role !== 'ADMIN' ? [{ path: '/snippet/new', icon: PlusCircle, label: t('add_snippet') }] : []),
    { path: '/library', icon: Library, label: t('my_library') },
    { path: '/settings', icon: Settings, label: t('settings') },
  ];

  return (
    <aside className="w-72 glass-panel border-r border-border hidden lg:flex flex-col h-full sticky top-0 transition-all duration-500 z-20">
      <div className="h-24 flex items-center px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-transparent opacity-50"></div>
        <motion.div 
          animate={{ 
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 0.9, 1]
          }} 
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="relative z-10 p-2 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg shadow-primary/20 mr-3"
        >
           <Sparkles className="w-6 h-6 text-white" />
        </motion.div>
        <span className="font-black text-2xl tracking-tighter relative z-10 label-gradient">
          SnipMaster
        </span>
      </div>
      
      <div className="flex-1 py-8 px-5 space-y-3 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 group font-bold text-sm ${
                isActive 
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-xl shadow-primary/5' 
                  : 'text-secondary hover:text-primary hover:bg-primary/5 border border-transparent'
              }`
            }
          >
            <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`} />
            <span className="tracking-tight">{item.label}</span>
            {item.path === '/snippet/new' && (
              <div className="ml-auto w-2 h-2 bg-accent rounded-full animate-pulse shadow-[0_0_8px_var(--accent)]"></div>
            )}
          </NavLink>
        ))}

        {user?.role === 'ADMIN' && (
           <div className="pt-6 mt-6 border-t border-border/50">
             <div className="px-5 text-[10px] font-black text-secondary/50 uppercase tracking-[0.2em] mb-4">Master Hub</div>
             <NavLink
                to="/admin"
                className={({ isActive }) => 
                  `flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 group font-bold text-sm ${
                    isActive 
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20 shadow-xl shadow-red-500/5' 
                      : 'text-red-400 hover:text-red-500 hover:bg-red-500/10 border border-transparent'
                  }`
                }
              >
                <Shield className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12" />
                <span className="tracking-tight">{t('admin_panel')}</span>
              </NavLink>
           </div>
        )}
      </div>

      <div className="p-6">
        <div className="p-5 glass-panel rounded-3xl bg-gradient-to-tr from-primary/10 to-accent/5 border-dashed border-2 border-primary/20 text-center">
          <p className="text-xs font-bold text-secondary mb-3">Community Choice</p>
          <div className="text-[10px] font-medium leading-relaxed opacity-60">
            Share your best snippets and earn developer reputation.
          </div>
        </div>
      </div>
    </aside>
  );
}
