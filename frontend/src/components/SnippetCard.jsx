import React from 'react';
import { Link } from 'react-router-dom';
import { FileCode, Clock, Tag as TagIcon, ArrowRight, Copy, Download, Code, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

function downloadSnippetAsPDF(snippet) {
  const htmlContent = `
    <html>
    <head>
      <title>${snippet.title} - SnipMaster</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #1e293b; background: #f8fafc; }
        .card { background: white; border-radius: 16px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); padding: 32px; border: 1px solid #e2e8f0; }
        .header { border-bottom: 3px solid #6366f1; padding-bottom: 20px; margin-bottom: 24px; }
        .header h1 { font-size: 28px; margin: 0 0 8px; color: #0f172a; font-weight: 800; }
        .header .meta { font-size: 13px; color: #64748b; font-weight: 500; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 8px; font-size: 12px; font-weight: 700; margin-right: 8px; text-transform: uppercase; }
        .lang { background: #e0e7ff; color: #4338ca; }
        .tag { background: #f1f5f9; color: #475569; }
        .desc { font-size: 15px; color: #334155; margin-bottom: 24px; line-height: 1.6; font-style: italic; }
        .code-block { background: #020617; color: #f8fafc; padding: 24px; border-radius: 12px; font-family: 'Fira Code', 'Consolas', monospace; font-size: 14px; white-space: pre-wrap; line-height: 1.7; overflow-x: auto; border: 1px solid #1e293b; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #94a3b8; text-align: center; font-weight: 500; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>${snippet.title}</h1>
          <div class="meta">
            <span class="badge lang">${(snippet.language || 'text')}</span>
            Created by: ${snippet.authorUsername || 'Anonymous'}
          </div>
        </div>
        ${snippet.description ? `<div class="desc">${snippet.description}</div>` : ''}
        <div style="margin-bottom: 20px;">${(snippet.tags || []).map(t => `<span class="badge tag">#${t}</span>`).join(' ')}</div>
        <div class="code-block">${snippet.code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        <div class="footer">Exported from SnipMaster — Premium Code Snippet Vault</div>
      </div>
    </body>
    </html>
  `;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(htmlContent);
  printWindow.document.close();
  setTimeout(() => { printWindow.print(); }, 500);
}

import { useAuth } from '../hooks/useAuth';

export default function SnippetCard({ snippet }) {
  const { user } = useAuth();
  const languageColors = {
    javascript: 'from-amber-400 to-yellow-500',
    python: 'from-blue-500 to-sky-400',
    java: 'from-red-500 to-orange-600',
    go: 'from-cyan-500 to-emerald-400',
    html: 'from-orange-500 to-red-500',
    css: 'from-blue-600 to-indigo-500',
    default: 'from-primary to-accent'
  };

  const getLangGradient = (lang) => {
    return languageColors[lang?.toLowerCase()] || languageColors.default;
  };

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-panel p-6 rounded-[2rem] flex flex-col group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${getLangGradient(snippet.language)} shadow-lg`}>
            <Code className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-black text-xl group-hover:text-primary transition-colors line-clamp-1 tracking-tight">
            {snippet.title}
          </h3>
        </div>
        <div className={`text-[10px] font-black tracking-widest px-3 py-1 rounded-full border border-primary/20 bg-primary/5 uppercase text-primary`}>
          {snippet.language || 'Code'}
        </div>
      </div>
      
      <p className="text-secondary text-sm mb-6 line-clamp-2 leading-relaxed font-medium">
        {snippet.description || 'Elevate your project with this premium code snippet logic.'}
      </p>

      <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/5 relative group/code overflow-hidden">
        <div className="absolute top-0 right-0 p-2 flex gap-2 opacity-0 group-hover/code:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover/code:translate-y-0">
           <button 
             className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-xl text-white transition-colors border border-white/10" title="Copy Code"
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigator.clipboard.writeText(snippet.code); }}
           >
             <Copy className="w-4 h-4" />
           </button>
        </div>
        <pre className="text-xs font-mono text-secondary/90 whitespace-pre-wrap line-clamp-3 leading-relaxed">
          {snippet.code}
        </pre>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex -space-x-2">
          {(snippet.tags || []).slice(0, 3).map((tag, idx) => (
            <div key={idx} className="w-8 h-8 rounded-full bg-background border-2 border-panel flex items-center justify-center text-[10px] font-bold text-primary shadow-sm hover:z-10 hover:scale-110 transition-transform cursor-default" title={`#${tag}`}>
              {tag.charAt(0).toUpperCase()}
            </div>
          ))}
          {snippet.tags?.length > 3 && (
             <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-panel flex items-center justify-center text-[10px] font-bold text-primary">
               +{snippet.tags.length - 3}
             </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {(user && (snippet.authorId === user.id || snippet.authorUsername === user.username)) && (
             <Link 
               to={`/snippet/edit/${snippet.id}`} 
               className="p-3 rounded-2xl bg-secondary/5 hover:bg-primary/10 text-secondary hover:text-primary transition-all duration-300"
               title="Edit Snippet"
             >
               <Edit3 className="w-5 h-5" />
             </Link>
          )}
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); downloadSnippetAsPDF(snippet); }} 
            className="p-3 rounded-2xl bg-secondary/5 hover:bg-emerald-500/10 text-secondary hover:text-emerald-500 transition-all duration-300"
          >
            <Download className="w-5 h-5" />
          </button>
          <Link 
            to={`/snippet/${snippet.id}`} 
            className="p-3 rounded-2xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-lg shadow-primary/5"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
