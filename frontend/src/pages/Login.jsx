import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Code, KeyRound, User, ChevronRight } from 'lucide-react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login({ username, password });
    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background"
    >
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] animate-float pointer-events-none" style={{ animationDelay: '-3s' }}></div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-panel p-10 rounded-[2rem] relative overflow-hidden backdrop-blur-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary animate-pulse"></div>
          
          <div className="flex flex-col items-center mb-10">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }} 
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-gradient-to-tr from-primary to-accent p-0.5 rounded-2xl shadow-xl shadow-primary/20 mb-6"
            >
              <div className="w-full h-full bg-background/80 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <Code className="text-primary w-8 h-8" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-black label-gradient mb-2">
              {t('welcome')}
            </h1>
            <p className="text-secondary text-sm font-medium">
              {t('login_sub')}
            </p>
          </div>

          {error && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: "auto", opacity: 1 }} 
              className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold ml-2 text-secondary/80 flex items-center gap-2">
                <User className="w-4 h-4" /> {t('username_email')}
              </label>
              <div className="group relative">
                <input
                  type="text"
                  required
                  className="input-field pl-5 group-hover:border-primary/50 transition-all duration-300"
                  placeholder="e.g. vijay_yadav"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold ml-2 text-secondary/80 flex items-center gap-2">
                <KeyRound className="w-4 h-4" /> {t('password')}
              </label>
              <div className="group relative">
                <input
                  type="password"
                  required
                  className="input-field pl-5 group-hover:border-primary/50 transition-all duration-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" name="forgot_password_btn" className="text-sm font-bold text-primary hover:text-accent transition-colors duration-300">
                {t('forgot')}
              </Link>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-4 text-lg font-bold group shadow-2xl"
            >
              <span>{t('login')}</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-border flex flex-col items-center gap-4">
            <p className="text-sm text-secondary font-medium">
              {t('no_account')}
            </p>
            <Link 
              to="/register" 
              className="btn-secondary w-full py-3 border-dashed border-2 hover:border-primary/50 hover:text-primary"
            >
              {t('create_account')}
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
