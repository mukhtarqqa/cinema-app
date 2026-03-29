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
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto space-y-20">
      {isDemo && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-5 flex items-center gap-4 text-amber-400">
          <AlertCircle size={22} />
          <p className="text-sm">
            <strong>Демо режимі:</strong> Фильм деректері қазір симуляцияланған. Нақты деректер үшін AI Studio Secrets бөліміне <code>TMDB_API_KEY</code> қосыңыз.
          </p>
        </div>
      )}

      {/* --- PREMIER HERO SECTION --- */}
      <section className="relative min-h-[70vh] rounded-3xl overflow-hidden flex items-center p-6 sm:p-16 lg:p-20 group">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1512070679279-8988d32161be?q=80&w=1920&auto=format&fit=crop" 
            alt="Cinema" 
            className="w-full h-full object-cover opacity-60 md:opacity-80 transition-transform duration-1000 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Күрделі градиент: сол жақтан және төменнен қараңғылау */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(10,5,2,0.4)_0%,rgba(10,5,2,0.95)_70%,rgba(10,5,2,1)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-8 w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-7xl font-display font-bold leading-[0.95] tracking-tighter uppercase drop-shadow-2xl"
          >
            СІЗДІҢ КЕМЕЛ <br /> <span className="text-[var(--color-accent)] drop-shadow-[0_0_15px_var(--color-accent)]">КИНЕМАТОГРАФИЯЛЫҚ</span> ӘЛЕМІҢІЗ
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-xl text-white/90 max-w-lg drop-shadow"
          >
            Соңғы блокбастерлер мен танымал аниме серияларын жоғары сапада тамашалаңыз. Барлық таңдаулылар бір жерде.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto text-center pt-4"
          >
            <Link to="/movies" className="bg-[var(--color-accent)] text-white px-10 py-5 rounded-full font-bold hover:bg-[var(--color-accent)]/80 transition-all hover:scale-105 shadow-xl shadow-[var(--color-accent)]/30 w-full sm:w-auto">
              Фильмдерді көру
            </Link>
            <Link to="/anime" className="glass backdrop-blur-md bg-white/5 border border-white/10 text-white px-10 py-5 rounded-full font-bold hover:bg-white/10 hover:border-white/20 transition-all hover:scale-105 w-full sm:w-auto">
              Аниме көру
            </Link>
          </motion.div>
        </div>
      </section>
      {/* ----------------------------- */}

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight uppercase">ТАНЫМАЛ ФИЛЬМДЕР</h2>
          <Link to="/movies" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
            <span className="hidden sm:inline">Барлығын көру</span>
            <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
          {movies.length === 0 && [1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-[2/3] rounded-3xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight uppercase">СОҢҒЫ АНИМЕ</h2>
          <Link to="/anime" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
            <span className="hidden sm:inline">Барлығын көру</span>
            <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {animes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
          {animes.length === 0 && [1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-[2/3] rounded-3xl bg-white/5 animate-pulse" />
          ))}
        </div>
      </section>
    </div>
  );
};
