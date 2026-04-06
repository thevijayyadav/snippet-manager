import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Code2, Sparkles, Zap, Shield, ChevronRight, Github, Globe, Moon, Sun, ArrowRight } from 'lucide-react';

export default function Home() {
  const { lang, changeLanguage, t } = useLanguage();
  const { theme, cycleTheme } = useTheme();
  const [showLangDropdown, setShowLangDropdown] = useState(false);

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-primary" />,
      title: 'Smart Categorization',
      description: 'Auto-detects languages and intelligently analyzes your snippets to apply rich meta-tags instantly.'
    },
    {
      icon: <Shield className="w-6 h-6 text-accent" />,
      title: 'Private Boundaries',
      description: 'Lock down proprietary enterprise code or flexibly open source blocks to the global repository.'
    },
    {
      icon: <Zap className="w-6 h-6 text-sky-400" />,
      title: 'AI Code Summaries',
      description: 'Struggling to remember what old code did? Our embedded AI breaks down structures with one click.'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-white overflow-hidden relative transition-all duration-700">
      
      {/* Background Atmosphere */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-float pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[700px] h-[700px] bg-accent/10 rounded-full blur-[150px] animate-float pointer-events-none" style={{ animationDelay: '-3s' }}></div>

      {/* Header Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="p-2 bg-gradient-to-tr from-primary to-accent rounded-xl shadow-lg group-hover:rotate-12 transition-transform duration-300">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-2xl tracking-tighter label-gradient">SnipMaster</span>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 font-bold text-sm text-secondary">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#demo" className="hover:text-primary transition-colors">Enterprise</a>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative group/lang">
              <button 
                 onMouseEnter={() => setShowLangDropdown(true)}
                 onMouseLeave={() => setShowLangDropdown(false)}
                 className="p-2.5 rounded-xl hover:bg-primary/10 transition-colors flex items-center gap-2 text-secondary"
              >
                <Globe className="w-5 h-5" />
                <span className="text-xs uppercase font-black">{lang}</span>
              </button>
              <AnimatePresence>
                {showLangDropdown && (
                  <motion.div 
                    onMouseEnter={() => setShowLangDropdown(true)}
                    onMouseLeave={() => setShowLangDropdown(false)}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-1 w-40 glass-panel rounded-2xl shadow-2xl overflow-hidden p-2 z-50"
                  >
                    {['en', 'hi', 'mr'].map((l) => (
                      <button 
                        key={l}
                        onClick={() => {changeLanguage(l); setShowLangDropdown(false)}} 
                        className={`w-full text-left px-4 py-2.5 rounded-xl transition-all text-sm font-bold ${lang === l ? 'bg-primary text-white shadow-lg' : 'hover:bg-primary/10 text-secondary'}`}
                      >
                        {l === 'en' ? 'English' : l === 'hi' ? 'हिंदी' : 'मराठी'}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              onClick={() => cycleTheme()} 
              className="p-2.5 rounded-xl hover:bg-primary/10 transition-colors text-secondary"
            >
              {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : 
               theme === 'sunset' ? <Sun className="w-5 h-5 text-orange-400" /> : 
               theme === 'ocean' ? <Globe className="w-5 h-5 text-sky-400" /> : 
               <Sun className="w-5 h-5 text-yellow-500" />}
            </button>

            <Link to="/login" className="hidden sm:block text-sm font-black text-secondary hover:text-primary transition-colors mx-4">Sign In</Link>
            
            <Link to="/register" className="btn-primary px-6 py-2.5 text-sm font-black shadow-2xl">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-40 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.6, type: "spring" }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-panel border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-10 shadow-xl"
        >
          <Sparkles className="w-4 h-4" /> The Next-Generation Code Vault
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 40 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] max-w-5xl"
        >
          Craft, Store, & <br className="hidden md:block"/>
          <span className="label-gradient">
            Accelerate Your Code.
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-secondary font-medium max-w-2xl mb-14 leading-relaxed"
        >
          Centrally store, intelligently categorize, and beautifully format your snippets. Built for developer velocity.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link to="/register" className="btn-primary px-10 py-5 text-xl font-black group shadow-3xl">
            Start Coding Free
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Link>
          <a href="#demo" className="btn-secondary px-10 py-5 text-xl font-bold hover:border-primary/50">
            <Github className="w-6 h-6" /> Open Source
          </a>
        </motion.div>
      </main>

      {/* Features Grid */}
      <div id="features" className="relative z-10 py-32 border-t border-border/30 bg-panel/30">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Built for Developer Velocity</h2>
            <p className="text-secondary font-bold text-lg max-w-xl mx-auto">Everything you need to ship faster without rewriting legacy logic.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: idx * 0.15 }}
                className="glass-panel p-10 rounded-[3rem] hover:scale-105 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="mb-8 inline-flex p-4 rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-black mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-secondary leading-relaxed font-medium">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Visual Footer Piece */}
      <footer className="py-10 text-center border-t border-border/20 text-secondary text-sm font-bold">
        © 2026 SnipMaster Premium. All code belongs to the creators.
      </footer>
    </div>
  );
}
