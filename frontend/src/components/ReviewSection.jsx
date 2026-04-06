import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewSection({ snippetId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [snippetId]);

  const fetchReviews = async () => {
    try {
      const res = await api.get(`/reviews/snippet/${snippetId}`);
      setReviews(res.data);
    } catch (e) { console.error(e); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await api.post('/reviews', { snippetId, rating, comment });
      setComment('');
      fetchReviews();
    } catch (e) { console.error(e); }
  };

  return (
    <div className="mt-16 space-y-10">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-amber-500/10 rounded-2xl">
          <MessageSquare className="w-6 h-6 text-amber-500" />
        </div>
        <h3 className="text-2xl font-black label-gradient">Developer Feedback</h3>
      </div>

      <div className="glass-panel p-8 rounded-[2.5rem]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transition-transform active:scale-90"
              >
                <Star 
                  className={`w-8 h-8 ${ (hover || rating) >= star ? 'text-amber-500 fill-current' : 'text-secondary/20' } transition-colors duration-200`} 
                />
              </button>
            ))}
            <span className="ml-4 text-xs font-black text-secondary/40 uppercase tracking-widest">Select Stature</span>
          </div>
          
          <div className="relative">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a technical review or comment..."
              className="input-field min-h-[120px] resize-none pr-16"
            />
            <button 
              type="submit"
              className="absolute bottom-4 right-4 p-3 bg-primary text-white rounded-xl shadow-lg hover:scale-110 active:scale-95 transition-all"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>

      <div className="grid gap-6">
        <AnimatePresence>
          {reviews.map((rev, idx) => (
            <motion.div 
              key={rev.id || idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-panel p-6 rounded-3xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-black text-xs">
                    {rev.reviewerUsername?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-black text-sm tracking-tight">{rev.reviewerUsername}</p>
                    <p className="text-[10px] font-bold text-secondary/50 uppercase">{new Date(rev.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'text-amber-500 fill-current' : 'text-secondary/10'}`} />
                  ))}
                </div>
              </div>
              <p className="text-secondary text-sm font-medium leading-relaxed italic">
                "{rev.comment}"
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {reviews.length === 0 && (
          <div className="text-center py-10 opacity-30">
            <p className="text-sm font-black uppercase tracking-[0.2em]">No Transmissions Logged Yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
