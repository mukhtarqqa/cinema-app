import React, { useEffect, useState } from 'react';
import { tmdbService } from '../services/tmdb.js';
import { anilibriaService } from '../services/anilibria.js';
import { MovieCard } from '../components/MovieCard.jsx';
import { AnimeCard } from '../components/AnimeCard.jsx';
import { motion } from 'motion/react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home = () => {
  const [movies, setMovies] = useState([]);
  const [animes, setAnimes] = useState([]);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, animeData] = await Promise.all([
          tmdbService.getPopular(),
          anilibriaService.getLatest(6)
        ]);
        setMovies(movieData.results.slice(0, 6));
        setIsDemo(!!movieData.is_demo);
        setAnimes(animeData);
      } catch (error) {
        console.error('Failed to fetch home data', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto space-y-16">
      {isDemo && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4 text-amber-400">
          <AlertCircle size={20} />
          <p className="text-sm">
            <strong>Демо режимі:</strong> Фильм деректері қазір симуляцияланған. Нақты деректер үшін AI Studio Secrets бөліміне <code>TMDB_API_KEY</code> қосыңыз.
          </p>
        </div>
      )}

      <section className="relative h-[60vh] rounded-3xl overflow-hidden flex items-center p-8 sm:p-16">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/cinema/1920/1080?blur=4" 
            alt="Hero" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-2xl space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-7xl font-display font-bold leading-[0.9] tracking-tighter uppercase"
          >
            СІЗДІҢ КЕМЕЛ <br /> <span className="text-[var(--color-accent)]">КИНЕМАТОГРАФИЯЛЫҚ</span> ӘЛЕМІҢІЗ
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/60 max-w-md"
          >
            Соңғы блокбастерлер мен танымал аниме серияларын жоғары сапада тамашалаңыз. Барлық таңдаулылар бір жерде.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4"
          >
            <Link to="/movies" className="bg-[var(--color-accent)] text-white px-8 py-4 rounded-full font-bold hover:bg-[var(--color-accent)]/80 transition-colors">
              Фильмдерді көру
            </Link>
            <Link to="/anime" className="glass text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
              Аниме көру
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-display font-bold tracking-tight uppercase">ТАНЫМАЛ ФИЛЬМДЕР</h2>
          <Link to="/movies" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
            <span>Барлығын көру</span>
            <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
          {movies.length === 0 && [1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-display font-bold tracking-tight uppercase">СОҢҒЫ АНИМЕ</h2>
          <Link to="/anime" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
            <span>Барлығын көру</span>
            <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {animes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
          {animes.length === 0 && [1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-[2/3] rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </section>
    </div>
  );
};
