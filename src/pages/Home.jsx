import React, { useEffect, useState } from 'react';
import { tmdbService } from '../services/tmdb.js';
import { anilibriaService } from '../services/anilibria.js';
import { MovieCard } from '../components/MovieCard.jsx';
import { AnimeCard } from '../components/AnimeCard.jsx';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, AlertCircle, Play, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

let HERO_IMAGES = [
  "https://i.pinimg.com/736x/be/8f/76/be8f7696365c80435989a85838cc0666.jpg",
  "https://i.pinimg.com/736x/c1/74/18/c17418fef207f2778a3d133f797aa194.jpg",
  "https://i.pinimg.com/736x/20/a1/2d/20a12d3ac0c770b6ceea0b85bf3120d0.jpg"
];

// Skeleton placeholder card
let SkeletonCard = () => (
  <div className="aspect-[2/3] rounded-2xl skeleton" />
);

export const Home = () => {
  let [movies, setMovies] = useState([]);
  let [animes, setAnimes] = useState([]);
  let [isDemo, setIsDemo] = useState(false);
  let [loading, setLoading] = useState(true);
  let { t, i18n } = useTranslation();
  
  let getTMDBLanguage = (lang) => {
    if (lang === 'en') return 'en-US';
    return 'ru-RU';
  };

  let [currentImgIndex, setCurrentImgIndex] = useState(0);
  let [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let fetchData = async () => {
      setLoading(true);
      try {
        let tmdbLang = getTMDBLanguage(i18n.language);
        let [movieData, animeData] = await Promise.all([
          tmdbService.getPopular(1, tmdbLang),
          anilibriaService.getLatest(6)
        ]);
        setMovies(movieData.results.slice(0, 6));
        setIsDemo(!!movieData.is_demo);
        setAnimes(animeData);
      } catch (error) {
        console.error('Failed to fetch home data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [i18n.language]);

  useEffect(() => {
    if (isPaused) return;
    let timer = setInterval(() => {
      setCurrentImgIndex((prevIndex) => 
        prevIndex === HERO_IMAGES.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div className="pt-24 pb-16 px-1 sm:px-6 max-w-7xl mx-auto space-y-20">
      {/* Demo warning */}
      {isDemo && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4 text-amber-400"
        >
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm">{t('home.demo_mode')}</p>
        </motion.div>
      )}

      {/* Hero Section */}
      <section
        className="relative min-h-[420px] sm:min-h-[520px] lg:h-[58vh] lg:max-h-[640px] rounded-[2rem] overflow-hidden flex items-end p-6 sm:p-12 shadow-2xl border border-white/5"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background slides */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentImgIndex}
              src={HERO_IMAGES[currentImgIndex]} 
              alt={`Hero background ${currentImgIndex}`} 
              className="absolute inset-0 w-full h-full object-cover object-center sm:object-[center_10%]"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 0.85, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 1.2 }}
            />
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-6 w-full pb-6 sm:pb-0">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 w-fit"
          >
            <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#ff4d00] bg-[#ff4d00]/10 border border-[#ff4d00]/20 px-3 py-1.5 rounded-full">
              <Sparkles size={12} />
              Cinema Hub
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-[2.2rem] sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tighter uppercase drop-shadow-2xl"
          >
            <Trans i18nKey="home.banner_title">
              АСПАН МЕН ЖЕР <br /> 
              <span className="gradient-text whitespace-nowrap">АРАСЫНДА</span> — ТЕК МЕН <br />
              ҒАНА АСҚАҚПЫН
            </Trans>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-1"
          >
            <p className="text-white/40 text-sm sm:text-base italic font-medium leading-relaxed max-w-xl border-l-[3px] border-[#ff4d00] pl-5 py-1">
              &ldquo;Throughout heaven and earth, I alone am the honored one.&rdquo;
            </p>
            <p className="text-[10px] sm:text-xs font-black text-[#ff4d00]/70 pl-6 uppercase tracking-[0.3em]" data-no-translate="true">
              — Satoru Gojo
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-3 pt-2"
          >
            <Link
              to="/movies"
              className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-widest text-center shadow-2xl transition-all active:scale-95 glow-accent hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #ff4d00, #ff6a20)' }}
            >
              <Play size={16} fill="white" />
              {t('home.watch_movies')}
            </Link>
            <Link
              to="/anime"
              className="flex items-center justify-center gap-2 bg-white/8 backdrop-blur-md border border-white/15 text-white px-8 py-3.5 rounded-full font-bold text-sm uppercase tracking-widest text-center hover:bg-white/15 transition-all active:scale-95"
            >
              {t('home.watch_anime')}
            </Link>
          </motion.div>
        </div>

        {/* Dot navigation */}
        <div className="absolute bottom-5 right-6 flex items-center gap-2 z-10">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImgIndex(idx)}
              className={`transition-all duration-300 rounded-full ${
                idx === currentImgIndex
                  ? 'w-6 h-2 bg-[#ff4d00]'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Popular Movies */}
      <section className="px-3 sm:px-0 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight section-title">{t('home.popular_movies')}</h2>
          </div>
          <Link to="/movies" className="flex items-center gap-1.5 text-white/40 hover:text-[#ff4d00] transition-colors group">
            <span className="text-[11px] font-bold uppercase tracking-widest">{t('home.all')}</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          }
        </div>
      </section>

      {/* Latest Anime */}
      <section className="px-3 sm:px-0 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight section-title">{t('home.latest_anime')}</h2>
          </div>
          <Link to="/anime" className="flex items-center gap-1.5 text-white/40 hover:text-[#ff4d00] transition-colors group">
            <span className="text-[11px] font-bold uppercase tracking-widest">{t('home.all')}</span>
            <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : animes.map((anime) => <AnimeCard key={anime.id} anime={anime} />)
          }
        </div>
      </section>
    </div>
  );
};
