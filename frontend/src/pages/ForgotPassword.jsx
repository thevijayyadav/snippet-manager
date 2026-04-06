import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Mail, Unlock, ChevronLeft } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-background"
    >
      {/* Background Atmosphere */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] animate-float pointer-events-none" style={{ animationDelay: '-2s' }}></div>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-panel p-10 rounded-[2.5rem] text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-accent to-primary animate-pulse"></div>
          
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }} 
            className="w-16 h-16 bg-primary/10 p-4 rounded-2xl shadow-xl mb-6 inline-flex items-center justify-center"
          >
            <Unlock className="text-primary w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl font-black label-gradient mb-4">
            Reset Password
          </h1>
          
          {submitted ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-4">
              <div className="bg-primary/10 border border-primary/20 text-primary px-4 py-5 rounded-2xl text-sm font-bold mb-8 leading-relaxed shadow-inner">
                Magic link sent! Check your inbox to regain access to your vault.
              </div>
              <Link to="/login" className="btn-primary w-full py-4 font-black group">
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Return to Login
              </Link>
            </motion.div>
          ) : (
            <>
              <p className="text-secondary text-sm font-medium mb-10 leading-relaxed">
                Enter your registered email and we'll send a recovery link to secure your account.
              </p>
              <form onSubmit={handleSubmit} className="space-y-6 text-left">
                <div className="space-y-2">
                  <label className="text-xs font-black ml-2 text-secondary/70 flex items-center gap-2 uppercase tracking-widest">
                    <Mail className="w-3.5 h-3.5" /> Email Address
                  </label>
                  <input
                    type="email" 
                    required 
                    className="input-field"
                    placeholder="email@example.com" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full py-4 text-lg font-black shadow-3xl"
                >
                  Send Recovery Link
                </button>
              </form>
              <div className="mt-10 pt-8 border-t border-border/50">
                <p className="text-sm font-medium text-secondary">
                  Found your keys? <Link to="/login" className="text-primary hover:text-accent font-black transition-colors ml-1">Sign In</Link>
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
