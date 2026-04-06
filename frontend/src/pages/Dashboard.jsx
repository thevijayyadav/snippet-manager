import React, { useState, useEffect } from 'react';
import snippetService from '../services/snippetService';
import SnippetCard from '../components/SnippetCard';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Search, Plus, Home, Activity, Code2, Sparkles, TrendingUp, Download, Upload, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [snippets, setSnippets] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadSnippets(query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const loadSnippets = async (searchTerm = '') => {
    setLoading(true);
    try {
      const data = await snippetService.getAllSnippets(searchTerm);
      
      // Filter snippets so a user only sees their own snippets on the dashboard
      let userSnippets = data;
      if (user && user.role !== 'ADMIN') {
        userSnippets = data.filter(s => s.authorUsername === user.username || s.authorId === user.id);
      }
      
      setSnippets(userSnippets);
    } catch (e) {
      console.error("Failed to load snippets");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(snippets));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "snippets_export.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImport = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = async (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          for (const s of imported) {
            await snippetService.createSnippet(s);
          }
          loadSnippets();
          alert("Import successful!");
        }
      } catch (err) { alert("Invalid JSON file"); }
    };
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 relative">
      {/* Background Glows */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-[-10%] w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6 relative z-10">
        <motion.div initial={{ x: -25, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <Home className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-black label-gradient">
              {t('snippet_hub')}
            </h1>
          </div>
          <p className="text-secondary font-medium ml-12">{t('manage_snippets')}</p>
        </motion.div>

        <motion.div initial={{ x: 25, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex w-full lg:w-auto gap-4 items-center">
          <div className="relative flex-1 lg:w-80 group">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder={t('search_placeholder')} 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field pl-12 py-3.5 text-sm shadow-inner"
            />
          </div>
          
          <div className="flex gap-2">
            <button onClick={handleExport} className="btn-secondary px-4 hover:border-primary/50" title="Export JSON">
              <Download className="w-5 h-5" />
            </button>
            <label className="btn-secondary px-4 hover:border-primary/50 cursor-pointer" title="Import JSON">
              <Upload className="w-5 h-5" />
              <input type="file" className="hidden" accept=".json" onChange={handleImport} />
            </label>
          </div>
          
          {user?.role !== 'ADMIN' && (
            <Link to="/snippet/new" className="btn-primary shadow-xl">
              <Plus className="w-5 h-5" />
              <span className="font-bold">{t('new_snippet')}</span>
            </Link>
          )}
        </motion.div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 mt-8 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
             <div key={i} className="h-72 glass-panel rounded-3xl animate-pulse bg-white/5"></div>
          ))}
        </div>
      ) : (
        <>
          {user?.role === 'ADMIN' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 relative z-10 mb-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'User Growth', val: '+24%', color: 'var(--primary)', icon: <TrendingUp className="w-4 h-4" />, progress: 65 },
                  { label: 'Snippets', val: '1,284', color: '#3b82f6', icon: <Code2 className="w-4 h-4" />, progress: 82 },
                  { label: 'Storage', val: '4.2 GB', color: '#a855f7', icon: <Activity className="w-4 h-4" />, progress: 45 },
                  { label: 'Active', val: '248', color: '#10b981', icon: <Sparkles className="w-4 h-4" />, progress: 15 }
                ].map((stat, i) => (
                  <div key={i} className="glass-panel p-6 rounded-[2rem] border-b-4 border-transparent hover:border-primary/50 transition-all duration-500 hover:-translate-y-1 group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-white/5 rounded-lg text-secondary group-hover:text-primary transition-colors">
                        {stat.icon}
                      </div>
                      <div className="text-2xl font-black">{stat.val}</div>
                    </div>
                    <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-4">{stat.label}</div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: `${stat.progress}%` }} 
                        transition={{ delay: i * 0.1, duration: 1 }}
                        className="h-full bg-gradient-to-r from-primary to-accent"
                      ></motion.div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {user?.role !== 'ADMIN' ? (
            snippets.length > 0 ? (
              <motion.div 
                variants={container} initial="hidden" animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
              >
                {snippets.map((snippet) => (
                  <SnippetCard key={snippet.id} snippet={snippet} />
                ))}
              </motion.div>
            ) : (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-32 text-center glass-panel rounded-[3rem] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent"></div>
                <div className="bg-primary/10 p-6 rounded-full mb-6 text-primary">
                  <Search className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black mb-3">No snippets discovered</h3>
                <p className="text-secondary font-medium max-w-sm mb-8">
                  The code repository seems empty for this search. Try exploring different keywords.
                </p>
                <button onClick={() => setQuery('')} className="btn-secondary text-primary font-bold hover:bg-primary/10 border-primary/20">
                  Reset filter
                </button>
              </motion.div>
            )
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-20 text-center glass-panel rounded-[3rem]">
              <Shield className="w-16 h-16 text-primary mx-auto mb-6 opacity-20" />
              <h3 className="text-2xl font-black mb-2 opacity-50 uppercase tracking-widest">Authority Protocol Active</h3>
              <p className="text-secondary font-medium">As an Administrator, you manage the users and system matrix from the Admin Hub.</p>
              <Link to="/admin" className="btn-primary mt-8 inline-flex">Go to Admin Hub</Link>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}
