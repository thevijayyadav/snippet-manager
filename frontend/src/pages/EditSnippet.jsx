import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import snippetService from '../services/snippetService';
import { Save, X, Code, FileText, Hash, Lock, Unlock, Sparkles, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EditSnippet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    tags: '',
    isPrivate: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const data = await snippetService.getSnippetById(id);
        setFormData({
          title: data.title,
          description: data.description || '',
          code: data.code,
          language: data.language || 'javascript',
          tags: data.tags ? data.tags.join(', ') : '',
          isPrivate: data.isPrivate || false
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchSnippet();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formattedData = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      await snippetService.updateSnippet(id, formattedData);
      navigate(`/snippet/${id}`);
    } catch (error) {
      console.error('Error saving snippet', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-secondary font-black animate-pulse uppercase tracking-[0.2em] text-xs">Accessing Vault...</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto pb-20 px-4"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
          <div className="relative">
            <h1 className="text-4xl font-black flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-2xl shadow-xl">
                <Code className="w-8 h-8 text-white" />
              </div>
              <span className="label-gradient tracking-tight">Refine Intelligence</span>
            </h1>
            <p className="text-secondary font-bold mt-2 ml-16">Optimizing your stored snippet for peak performance.</p>
          </div>
        </div>
        
        <div className="flex gap-4 self-end md:self-center">
          <button onClick={() => navigate(-1)} className="btn-secondary px-6">
            <X className="w-5 h-5" /> Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            disabled={saving || !formData.title || !formData.code} 
            className="btn-primary px-8 shadow-2xl disabled:opacity-50 disabled:hover:scale-100"
          >
            <Save className="w-5 h-5 shadow-inner" /> 
            {saving ? 'Transmitting...' : 'Update Snippet'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          <div className="glass-panel p-8 rounded-[2.5rem] relative overflow-hidden group/editor">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30"></div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black ml-2 text-secondary/70 flex items-center gap-2 uppercase tracking-widest">
                  <Terminal className="w-3.5 h-3.5" /> Project Title
                </label>
                <input
                  type="text"
                  required
                  className="input-field text-xl font-bold font-sans"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black ml-2 text-secondary/70 flex items-center gap-2 uppercase tracking-widest justify-between">
                  <div className="flex items-center gap-2"><Code className="w-3.5 h-3.5" /> Source Code</div>
                  <div className="flex items-center gap-4">
                    <select 
                      className="bg-panel border border-border rounded-xl text-[10px] font-black px-3 py-1 text-primary focus:ring-1 focus:ring-primary outline-none transition-all uppercase tracking-wider"
                      value={formData.language}
                      onChange={e => setFormData({...formData, language: e.target.value})}
                    >
                      {['javascript', 'python', 'java', 'go', 'html', 'sql', 'typescript'].map(lang => (
                        <option key={lang} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </label>
                <div className="relative group/textarea">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-accent/10 rounded-[1.5rem] blur opacity-0 group/textarea:opacity-100 transition duration-500"></div>
                  <textarea
                    required
                    className="relative w-full h-[32rem] bg-background/50 border border-border rounded-[1.5rem] py-6 px-6 focus:ring-2 focus:ring-primary/20 text-foreground font-mono text-sm placeholder-secondary/30 transition-all outline-none resize-none shadow-inner"
                    value={formData.code}
                    onChange={e => setFormData({...formData, code: e.target.value})}
                    spellCheck="false"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="glass-panel p-8 rounded-[2.5rem] space-y-8 sticky top-24">
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-secondary/50 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Metadata
              </h3>
              
              <div className="space-y-2">
                <label className="text-xs font-black ml-2 text-secondary/70 uppercase tracking-widest">Description</label>
                <textarea
                  className="input-field h-32 text-sm font-medium resize-none leading-relaxed"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black ml-2 text-secondary/70 flex items-center gap-2 uppercase tracking-widest">
                  <Hash className="w-3.5 h-3.5" /> Tags
                </label>
                <input
                  type="text"
                  className="input-field text-sm font-bold"
                  value={formData.tags}
                  onChange={e => setFormData({...formData, tags: e.target.value})}
                />
              </div>
            </div>
            
            <div className="pt-6 border-t border-border/50">
              <label className="text-xs font-black ml-2 text-secondary/70 uppercase tracking-widest mb-4 block text-center">Visibility Protocol</label>
              <div 
                className={`p-6 rounded-[2rem] border-2 transition-all duration-300 cursor-pointer group/toggle ${
                  formData.isPrivate 
                    ? 'bg-panel border-primary shadow-lg shadow-primary/10' 
                    : 'bg-background/50 border-border opacity-60 hover:opacity-100 hover:border-primary/30'
                }`}
                onClick={() => setFormData({...formData, isPrivate: !formData.isPrivate})}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl transition-all duration-500 ${
                    formData.isPrivate ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-panel text-secondary group-hover:scale-105'
                  }`}>
                     {formData.isPrivate ? <Lock className="w-6 h-6" /> : <Unlock className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="font-black text-sm tracking-tight">{formData.isPrivate ? 'Private Vault' : 'Open Source'}</div>
                    <div className="text-[10px] font-bold text-secondary/60 leading-tight mt-0.5">
                      {formData.isPrivate ? 'Encrypted for you only' : 'Shared with the community'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
