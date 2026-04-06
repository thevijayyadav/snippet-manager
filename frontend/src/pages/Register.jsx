import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Code, KeyRound, User, Mail, Type, ChevronRight } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ fullName: '', username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    const { confirmPassword, ...payload } = formData;
    const res = await register(payload);
    if (res.success) {
      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(res.message);
    }
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background"
    >
      {/* Background Atmosphere */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] animate-float pointer-events-none" style={{ animationDelay: '-4s' }}></div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-lg z-10"
      >
        <div className="glass-panel p-10 rounded-[2.5rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary animate-pulse"></div>
          
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }} 
              className="w-14 h-14 bg-primary/10 p-3 rounded-2xl shadow-xl mb-4 flex items-center justify-center"
            >
              <Code className="text-primary w-8 h-8" />
            </motion.div>
            <h1 className="text-4xl font-black label-gradient mb-2">
              {t('register_title')}
            </h1>
            <p className="text-secondary text-sm font-medium">
              {t('register_sub')}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm font-bold flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
              {error}
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }}
              className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-xl mb-6 text-sm font-bold flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
              {successMsg}
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black ml-2 text-secondary/70 flex items-center gap-2 uppercase tracking-widest">
                <Type className="w-3.5 h-3.5" /> {t('fullname')}
              </label>
              <input
                type="text" name="fullName" required className="input-field"
                placeholder="Full Name" value={formData.fullName} onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black ml-2 text-secondary/70 flex items-center gap-2 uppercase tracking-widest">
                <User className="w-3.5 h-3.5" /> Username
              </label>
              <input
                type="text" name="username" required className="input-field"
                placeholder="username" value={formData.username} onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black ml-2 text-secondary/70 flex items-center gap-2 uppercase tracking-widest">
                <Mail className="w-3.5 h-3.5" /> {t('email')}
              </label>
              <input
                type="email" name="email" required className="input-field"
                placeholder="email@example.com" value={formData.email} onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black ml-2 text-secondary/70 flex items-center gap-2 uppercase tracking-widest">
                <KeyRound className="w-3.5 h-3.5" /> {t('password')}
              </label>
              <input
                type="password" name="password" required className="input-field"
                placeholder="••••••••" value={formData.password} onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black ml-2 text-secondary/70 flex items-center gap-2 uppercase tracking-widest">
                <KeyRound className="w-3.5 h-3.5" /> Confirm
              </label>
              <input
                type="password" name="confirmPassword" required className="input-field"
                placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                className="btn-primary w-full py-4 text-lg font-black group shadow-3xl"
              >
                <span>{t('signup')}</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm font-medium text-secondary">
            {t('has_account')} {' '}
            <Link to="/login" className="text-primary hover:text-accent font-black transition-colors">
              {t('login')}
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
