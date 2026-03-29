import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { db } from '../firebase.js';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Loader2 } from 'lucide-react';

export const Favorites = () => {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'favorites'), 
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setFavorites(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  if (authLoading || (user && loading)) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-[var(--color-accent)]" size={48} />
    </div>
  );

  if (!user) return (
    <div className="pt-40 text-center space-y-4">
      <h1 className="text-3xl font-display font-bold uppercase">Таңдаулыларды көру үшін жүйеге кіріңіз</h1>
      <Link to="/" className="inline-block bg-[var(--color-accent)] px-6 py-2 rounded-full font-bold uppercase">Басты бетке</Link>
    </div>
  );

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-4xl font-display font-bold tracking-tight flex items-center gap-3 uppercase">
        <Heart className="text-[var(--color-accent)]" fill="currentColor" size={32} />
        СІЗДІҢ ТАҢДАУЛЫЛАРЫҢЫЗ
      </h1>

      {favorites.length === 0 ? (
        <div className="h-[40vh] flex flex-col items-center justify-center text-white/40 space-y-4">
          <p className="text-xl">Сіз әлі ештеңе қоспадыңыз.</p>
          <Link to="/movies" className="text-[var(--color-accent)] hover:underline font-bold uppercase">Мазмұнды зерттеу</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {favorites.map((fav) => (
            <motion.div 
              key={fav.id}
              whileHover={{ y: -8 }}
              className="group relative aspect-[2/3] rounded-2xl overflow-hidden glass"
            >
              <Link to={`/${fav.contentType}/${fav.contentId}`}>
                <img 
                  src={fav.contentType === 'movie' ? `https://image.tmdb.org/t/p/w500${fav.posterPath}` : `https://anilibria.top${fav.posterPath}`} 
                  alt={fav.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="font-display font-bold text-lg leading-tight mb-1 uppercase">{fav.title}</h3>
                  <span className="text-xs uppercase font-bold tracking-widest text-[var(--color-accent)]">{fav.contentType === 'movie' ? 'Фильм' : 'Аниме'}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
