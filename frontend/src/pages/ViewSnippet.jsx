import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import snippetService from '../services/snippetService';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Copy, Edit, Trash2, Tag as TagIcon, Clock, User, Share2, Sparkles, CheckCheck, Terminal, Shield, Zap, Lock, Star } from 'lucide-react';
import ReviewSection from '../components/ReviewSection';

export default function ViewSnippet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [explaining, setExplaining] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const data = await snippetService.getSnippetById(id);
        setSnippet(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSnippet();
  }, [id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExplain = async () => {
    setExplaining(true);
    try {
      const data = await snippetService.explainCode(snippet.code, snippet.language);
      setExplanation(data.explanation);
    } catch (e) {
      setExplanation("Failed to connect to AI Hub. Please check your transmission.");
    } finally {
      setExplaining(false);
    }
  };

  const handleRollback = async (vNum) => {
    if (window.confirm(`Rollback to version ${vNum}?`)) {
      try {
         const updated = await snippetService.rollbackSnippet(id, vNum);
         setSnippet(updated);
      } catch (e) {
         console.error(e);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this snippet?")) {
      try {
        await snippetService.deleteSnippet(id);
        navigate('/dashboard');
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-secondary font-black animate-pulse uppercase tracking-[0.2em] text-xs">Decrypting Records...</p>
    </div>
  );
  
  if (!snippet) return (
    <div className="p-20 text-center">
      <div className="inline-flex p-6 rounded-full bg-red-500/10 text-red-500 mb-6">
        <Shield className="w-12 h-12" />
      </div>
      <h2 className="text-2xl font-black mb-4">Snippet Lost in Space</h2>
      <button onClick={() => navigate('/dashboard')} className="btn-secondary px-8">Return to Safety</button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto pb-20 px-4"
    >
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center gap-3 mb-10 text-secondary hover:text-primary font-bold transition-all duration-300"
      >
        <div className="p-2 rounded-xl bg-panel border border-border group-hover:scale-110 transition-transform shadow-lg group-hover:bg-primary/5">
          <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="tracking-tight">Back to Hub</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-panel p-8 md:p-10 rounded-[3rem] relative overflow-hidden transition-all hover:bg-panel/40">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-10">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <h1 className="text-4xl md:text-5xl font-black tracking-tighter label-gradient leading-none">
                    {snippet.title}
                  </h1>
                  <div className="flex gap-2">
                    <span className="px-4 py-1.5 rounded-full text-[10px] font-black border border-border bg-background/50 text-secondary uppercase tracking-[0.15em] shadow-sm">
                      {snippet.language}
                    </span>
                    {snippet.isPrivate && (
                      <span className="px-4 py-1.5 rounded-full text-[10px] font-black border border-accent/20 bg-accent/5 text-accent uppercase tracking-[0.15em] shadow-sm flex items-center gap-1.5">
                        <Lock className="w-3 h-3" /> Private
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-secondary text-lg font-medium leading-relaxed max-w-3xl">
                  {snippet.description || 'This brilliance has yet to be described.'}
                </p>
                
                <div className="flex flex-wrap items-center gap-6 mt-8 text-xs font-black uppercase tracking-widest text-secondary/50">
                  <span className="flex items-center gap-2.5">
                    <div className="p-2 bg-primary/10 rounded-lg"><User className="w-4 h-4 text-primary" /></div>
                    {snippet.authorUsername || snippet.author || 'Senior Architect'}
                  </span>
                  <span className="flex items-center gap-2.5">
                    <div className="p-2 bg-accent/10 rounded-lg"><Zap className="w-4 h-4 text-accent" /></div>
                    {snippet.views} VIEWS
                  </span>
                  <span className="flex items-center gap-2.5">
                    <div className="p-2 bg-emerald-100 rounded-lg"><Copy className="w-4 h-4 text-emerald-600" /></div>
                    {snippet.copyCount} COPIES
                  </span>
                  <span className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-100 rounded-lg"><Star className="w-4 h-4 text-amber-600" /></div>
                    {snippet.averageRating?.toFixed(1)} RATING
                  </span>
                </div>
              </div>
              
              <div className="flex flex-row md:flex-col gap-3">
                <button 
                  onClick={async () => { await snippetService.toggleFavorite(id); setSnippet({...snippet, favorites: !snippet.favorites}); }}
                  className={`btn-secondary p-3.5 ${snippet.likedBy?.length > 0 ? 'text-amber-500 bg-amber-50/50 border-amber-200' : ''}`} 
                  title="Toggle Favorite"
                >
                  <Star className={`w-5 h-5 ${snippet.likedBy?.length > 0 ? 'fill-current' : ''}`} />
                </button>
                <button className="btn-secondary p-3.5" title="Generate Share Access">
                  <Share2 className="w-5 h-5" />
                </button>
                <Link to={`/snippet/edit/${snippet.id}`} className="btn-secondary p-3.5 text-primary hover:bg-primary/10" title="Modify Structure">
                  <Edit className="w-5 h-5" />
                </Link>
                <button onClick={handleDelete} className="btn-secondary p-3.5 text-red-500 hover:bg-red-500/10" title="Decommission Snippet">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {snippet.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mb-10">
                {snippet.tags.map((tag, idx) => (
                  <span key={idx} className="flex items-center text-[10px] font-black text-secondary/60 bg-panel border-2 border-border/40 px-4 py-2 rounded-2xl transition-all hover:scale-105 hover:border-primary/20 hover:text-primary">
                    <TagIcon className="w-3.5 h-3.5 mr-2 opacity-50" />
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            )}

            {/* Code and Preview Tabbed View */}
            <div className="flex gap-2 mb-4 bg-panel/30 p-1.5 rounded-2xl border border-border w-fit">
              <button onClick={() => setShowPreview(false)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!showPreview ? 'bg-primary text-white shadow-lg' : 'text-secondary hover:bg-panel'}`}>Source Code</button>
              {(snippet.language === 'html' || snippet.language === 'javascript' || snippet.language === 'css') && (
                 <button onClick={() => setShowPreview(true)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${showPreview ? 'bg-primary text-white shadow-lg' : 'text-secondary hover:bg-panel'}`}>Live Preview</button>
              )}
            </div>

            <div className="relative rounded-[2rem] overflow-hidden border border-border/60 bg-background/30 shadow-2xl min-h-[300px]">
              {!showPreview ? (
                <>
                  <div className="flex items-center justify-between px-6 py-4 bg-panel border-b border-border transition-colors group/header">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-background/50 rounded-lg border border-border shadow-inner">
                        <Terminal className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] text-secondary font-black uppercase tracking-widest">{snippet.language} source</span>
                      </div>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-2 text-xs font-black text-secondary hover:text-primary transition-all duration-300 px-4 py-1.5 rounded-xl hover:bg-primary/5 active:scale-95"
                    >
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.span key="copied" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="flex items-center gap-2 text-primary">
                            <CheckCheck className="w-4 h-4" /> SECURED TO CLIPBOARD
                          </motion.span>
                        ) : (
                          <motion.span key="copy" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="flex items-center gap-2">
                            <Copy className="w-4 h-4" /> ACCESS SOURCE
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                  <div className="p-8 overflow-x-auto custom-scrollbar">
                    <pre className="text-sm font-mono leading-relaxed text-foreground/90 selection:bg-primary/20">
                      <code>{snippet.code}</code>
                    </pre>
                  </div>
                </>
              ) : (
                <div className="bg-white h-[400px]">
                  <iframe 
                    title="Live Preview" 
                    srcDoc={snippet.language === 'html' ? snippet.code : `<html><body><script>${snippet.code}</script></body></html>`} 
                    className="w-full h-full border-none"
                  />
                </div>
              )}
            </div>

            {/* Version History Section */}
            {snippet.versions?.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-black tracking-tight mb-6 label-gradient">Version Log</h3>
                <div className="space-y-4">
                  {snippet.versions.map((v, idx) => (
                    <div key={idx} className="glass-panel p-5 rounded-2xl flex items-center justify-between border-dashed">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-panel border rounded-xl text-primary font-black text-xs">V{v.versionNumber}</div>
                        <div>
                          <p className="text-xs font-black uppercase text-secondary/60 tracking-widest">{v.modificationReason}</p>
                          <p className="text-[10px] text-secondary/40 font-bold mt-1">{new Date(v.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <button onClick={() => handleRollback(v.versionNumber)} className="text-xs font-black text-primary hover:underline flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> RE-ACTIVATE
                      </button>
                    </div>
                  )).reverse()}
                </div>
              </div>
            )}
            {/* Review & Rating System */}
            <ReviewSection snippetId={id} />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="glass-panel p-10 rounded-[3rem] border-primary/20 relative overflow-hidden sticky top-24 shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[80px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="space-y-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-xl">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight label-gradient">Neuro-Scan</h3>
                  <p className="text-[10px] font-black text-secondary/60 uppercase tracking-[0.15em] mt-1">AI Logic Synthesis</p>
                </div>
              </div>
              
              <div className="p-6 rounded-[2rem] bg-background/50 border border-border shadow-inner">
                <p className="text-xs font-bold text-secondary leading-relaxed mb-6">
                  Experience a high-fidelity breakdown of your industrial-grade code architecture.
                </p>
                
                <button 
                  onClick={handleExplain}
                  disabled={explaining || explanation !== ''}
                  className={`btn-primary w-full py-4 text-sm font-black group shadow-3xl ${explaining || explanation ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <Zap className="w-4 h-4 group-hover:animate-pulse" /> 
                  {explaining ? 'RECONSTITUTING...' : explanation ? 'SYNTHESIS COMPLETE' : 'ACTIVATE AI HUB'}
                </button>
              </div>

              <AnimatePresence>
                {explaining && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: "auto", opacity: 1 }}
                    className="space-y-3"
                  >
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-4 bg-primary/5 rounded-full animate-pulse blur-[1px]"></div>
                    ))}
                  </motion.div>
                )}
                
                {explanation && !explaining && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    className="p-6 rounded-[2rem] bg-primary/10 border-2 border-primary/20 text-foreground font-medium text-sm leading-relaxed shadow-xl border-dashed"
                  >
                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                       <Shield className="w-3.5 h-3.5" /> Intelligence Report
                    </div>
                    {explanation}
                  </motion.div>
                )}
              </AnimatePresence>

              {!explanation && !explaining && (
                <div className="text-center pt-4">
                  <div className="inline-flex px-4 py-1.5 rounded-full bg-panel border-border text-[9px] font-black text-secondary/50 uppercase tracking-widest">
                    Awaiting Signal
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
