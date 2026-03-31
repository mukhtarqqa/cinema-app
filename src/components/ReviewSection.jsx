import React, { useEffect, useState } from 'react';
import { db, handleFirestoreError, OperationType } from '../firebase.js';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth.jsx';
import { Star, Send, Trash2, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ReviewSection = ({ contentId, contentType }) => {
  let { user, login } = useAuth();
  let [reviews, setReviews] = useState([]);
  let [text, setText] = useState('');
  let [rating, setRating] = useState(10);
  let { t } = useTranslation();

  useEffect(() => {
    let q = query(
      collection(db, 'reviews'),
      where('contentId', '==', contentId),
      where('contentType', '==', contentType),
      orderBy('createdAt', 'desc')
    );
    let unsubscribe = onSnapshot(q, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [contentId, contentType]);

  let handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return login();
    if (!text.trim()) return;

    try {
      await addDoc(collection(db, 'reviews'), {
        uid: user.uid,
        authorName: user.displayName || t('reviews.anonymous'),
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

  let deleteReview = async (id) => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, 'reviews');
    }
  };

  return (
    <div className="space-y-8 pt-12 border-t border-white/5 w-full overflow-hidden">
      <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight uppercase">{t('reviews.title')}</h2>

      <form onSubmit={handleSubmit} className="glass p-5 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{t('reviews.rating')}</span>
          <div className="flex flex-wrap gap-0.5 sm:gap-1 justify-center">
            {[...Array(10)].map((_, i) => (
              <button 
                key={i} 
                type="button"
                onClick={() => setRating(i + 1)}
                className={`p-1 transition-colors ${rating > i ? 'text-yellow-400' : 'text-white/10'}`}
              >
                <Star size={18} fill="currentColor" />
              </button>
            ))}
          </div>
        </div>
        <textarea 
          placeholder={t('reviews.placeholder')}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[100px] focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none text-sm"
        />
        <div className="flex justify-end">
          <button type="submit" className="flex items-center gap-2 bg-[var(--color-accent)] px-6 py-3 rounded-full font-bold hover:bg-[var(--color-accent)]/80 transition-colors w-full sm:w-auto justify-center">
            <Send size={18} />
            <span>{t('reviews.send')}</span>
          </button>
        </div>
      </form>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="glass p-5 rounded-3xl space-y-4 overflow-hidden">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <User size={18} className="text-white/40" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold truncate text-sm">{review.authorName}</h4>
                  <p className="text-[10px] text-white/40">{review.createdAt?.toDate().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-400 font-bold shrink-0 text-sm">
                <Star size={14} fill="currentColor" />
                <span>{review.rating}</span>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed break-words">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
