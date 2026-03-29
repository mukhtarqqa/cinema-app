import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase.js';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth.jsx';
import { Star, Send, Trash2, User } from 'lucide-react';

export const ReviewSection = ({ contentId, contentType }) => {
  const { user, login } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState('');
  const [rating, setRating] = useState(10);

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('contentId', '==', contentId),
      where('contentType', '==', contentType),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [contentId, contentType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return login();
    if (!text.trim()) return;

    try {
      await addDoc(collection(db, 'reviews'), {
        uid: user.uid,
        authorName: user.displayName || 'Аноним',
        contentId,
        contentType,
        rating,
        text,
        createdAt: serverTimestamp(),
      });
      setText('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'reviews');
    }
  };

  const deleteReview = async (id) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'reviews');
    }
  };

  return (
    <div className="space-y-8 pt-12 border-t border-white/5 w-full overflow-hidden">
      <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">ПІКІРЛЕР</h2>

      <form onSubmit={handleSubmit} className="glass p-4 sm:p-6 rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span className="text-xs sm:text-sm font-bold text-white/60 uppercase tracking-widest text-center sm:text-left">
            Бағалау ({contentType === 'movie' ? 'фильм' : 'аниме'})
          </span>
          <div className="flex justify-center flex-wrap gap-1 sm:gap-1.5">
            {[...Array(10)].map((_, i) => (
              <button 
                key={i} 
                type="button"
                onClick={() => setRating(i + 1)}
                className={`p-1 transition-all hover:scale-110 ${rating > i ? 'text-yellow-400' : 'text-white/10'}`}
              >
                <Star size={20} fill="currentColor" className="sm:w-5 sm:h-5 w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
        
        <textarea 
          placeholder="Өз ойыңызбен бөлісіңіз..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[120px] focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm sm:text-base resize-none"
        />
        
        <div className="flex justify-end">
          <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--color-accent)] px-8 py-4 rounded-full font-bold hover:bg-[var(--color-accent)]/80 transition-all active:scale-95">
            <Send size={18} />
            <span>Жіберу</span>
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-white/40 text-center py-8">Әзірге пікірлер жоқ. Алғашқы болып пікір қалдырыңыз!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="glass p-5 sm:p-6 rounded-3xl space-y-4 overflow-hidden">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <User size={20} className="text-white/40" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold truncate text-sm sm:text-base">{review.authorName}</h4>
                    <p className="text-[10px] sm:text-xs text-white/40">{review.createdAt?.toDate().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                  <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm sm:text-base">
                    <Star size={14} fill="currentColor" />
                    <span>{review.rating}</span>
                  </div>
                  {user?.uid === review.uid && (
                    <button onClick={() => deleteReview(review.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-white/80 leading-relaxed text-sm sm:text-base break-words">{review.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
