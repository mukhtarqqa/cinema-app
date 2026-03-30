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

      {/* HERO SECTION - GOJO STYLE */}
      <section className="relative min-h-[60vh] sm:min-h-[70vh] rounded-[2.5rem] overflow-hidden flex items-center p-6 sm:p-16 border border-white/5 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1920&auto=format&fit=crop" 
            alt="Gojo Satoru Aesthetic" 
            className="w-full h-full object-cover opacity-50 object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl space-y-8 w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-7xl lg:text-8xl font-black leading-[1] tracking-tighter uppercase"
          >
            АСПАН МЕН ЖЕР <br /> 
            <span className="text-[var(--color-accent)]">АРАСЫНДА</span> — ТЕК МЕН <br />
            ҒАНА АСҚАҚПЫН
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2 border-l-2 border-[var(--color-accent)]/50 pl-6"
          >
            <p className="text-lg sm:text-2xl text-white/70 font-medium italic">
              "Среди неба и земли, я один достоин чести."
            </p>
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.4em] text-[var(--color-accent)] opacity-80">
              — Годжо Сатору
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <Link to="/movies" className="bg-[var(--color-accent)] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:brightness-110 transition-all text-center shadow-lg shadow-[var(--color-accent)]/20 active:scale-95">
              Фильмдерді көру
            </Link>
            <Link to="/anime" className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all text-center active:scale-95">
              Аниме көру
            </Link>
          </motion.div>
        </div>
      </section>

      {/* MOVIES SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase">ТАНЫМАЛ ФИЛЬМДЕР</h2>
          <Link to="/movies" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">Барлығы</span>
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

      {/* ANIME SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight uppercase">СОҢҒЫ АНИМЕ</h2>
          <Link to="/anime" className="flex items-center gap-1 text-white/60 hover:text-white transition-colors">
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest">Барлығы</span>
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
