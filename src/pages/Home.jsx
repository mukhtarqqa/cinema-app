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
    /* px-1 АРҚЫЛЫ ТЕЛЕФОНДА ШЕТІНЕ БАРЫНША ЖАҚЫНДАТТЫҚ */
    <div className="pt-24 pb-12 px-1 sm:px-6 max-w-7xl mx-auto space-y-16">
      {isDemo && (
        <div className="mx-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4 text-amber-400">
          <AlertCircle size={20} />
          <p className="text-sm">Демо режимі қосулы.</p>
        </div>
      )}

      {/* HERO SECTION - СЕН БЕРГЕН ФОТО ЖӘНЕ ТҮЗЕТІЛГЕН МӘТІН */}
      <section className="relative min-h-[550px] sm:min-h-[750px] rounded-[2.5rem] overflow-hidden flex items-center p-6 sm:p-20 shadow-2xl border border-white/5">
        <div className="absolute inset-0 z-0">
          <img 
            /* СЕН ЖІБЕРГЕН PININTEREST СІЛТЕМЕСІ */
            src="https://i.pinimg.com/736x/7a/83/40/7a83402d95e085d9f69c14d19156fced.jpg" 
            alt="Gojo Satoru Awakening" 
            className="w-full h-full object-cover object-center opacity-80"
          />
          {/* Текст жақсы көріну үшін градиентті күшейттім */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl space-y-10 w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[1.8rem] sm:text-7xl lg:text-8xl font-black leading-[1.05] tracking-tighter uppercase"
          >
            АСПАН МЕН ЖЕР <br /> 
            <span className="text-[#ff4d00] whitespace-nowrap">АРАСЫНДА</span> — ТЕК МЕН <br />
            ҒАНА АСҚАҚПЫН
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <p className="text-white/70 text-lg sm:text-2xl font-medium leading-relaxed max-w-2xl border-l-2 border-[#ff4d00]/50 pl-6">
              "Среди неба и земли, я один достоин чести."
            </p>
            <p className="text-sm sm:text-base font-bold text-[#ff4d00] pl-6 uppercase tracking-widest">
              — Годжо Сатору
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-5 pt-4"
          >
            <Link to="/movies" className="bg-[#ff4d00] text-white px-14 py-4 rounded-full font-bold text-sm uppercase tracking-widest text-center shadow-2xl shadow-[#ff4d00]/30 hover:scale-105 transition-all active:scale-95">
              Фильмдерді көру
            </Link>
            <Link to="/anime" className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-14 py-4 rounded-full font-bold text-sm uppercase tracking-widest text-center hover:bg-white/10 transition-all active:scale-95">
              Аниме көру
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ТАНЫМАЛ СЕКЦИЯЛАР (ӨЗГЕРІССІЗ) */}
      <section className="px-3 sm:px-0 space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight">Танымал фильмдер</h2>
          <Link to="/movies" className="flex items-center gap-1 text-white/40 hover:text-white transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-widest">Барлығы</span>
            <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      <section className="px-3 sm:px-0 space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight">Соңғы аниме</h2>
          <Link to="/anime" className="flex items-center gap-1 text-white/40 hover:text-white transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-widest">Барлығы</span>
            <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {animes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      </section>
    </div>
  );
};
