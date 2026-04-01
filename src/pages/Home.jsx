import React, { useEffect, useState } from 'react';
import { tmdbService } from '../services/tmdb.js';
import { anilibriaService } from '../services/anilibria.js';
import { MovieCard } from '../components/MovieCard.jsx';
import { AnimeCard } from '../components/AnimeCard.jsx';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';

let HERO_IMAGES = [
  "https://i.pinimg.com/736x/be/8f/76/be8f7696365c80435989a85838cc0666.jpg",
  "https://i.pinimg.com/736x/c1/74/18/c17418fef207f2778a3d133f797aa194.jpg",
  "https://i.pinimg.com/736x/20/a1/2d/20a12d3ac0c770b6ceea0b85bf3120d0.jpg"
];

export const Home = () => {
  let [movies, setMovies] = useState([]);
  let [animes, setAnimes] = useState([]);
  let [isDemo, setIsDemo] = useState(false);
  let { t, i18n } = useTranslation();
  
  let getTMDBLanguage = (lang) => {
    if (lang === 'en') return 'en-US';
    return 'ru-RU';
  };

  let [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    let fetchData = async () => {
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
      }
    };
    fetchData();
  }, [i18n.language]);

  useEffect(() => {
    let timer = setInterval(() => {
      setCurrentImgIndex((prevIndex) => 
        prevIndex === HERO_IMAGES.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pt-24 pb-12 px-1 sm:px-6 max-w-7xl mx-auto space-y-16">
      {isDemo && (
        <div className="mx-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4 text-amber-400">
          <AlertCircle size={20} />
          <p className="text-sm">{t('home.demo_mode')}</p>
        </div>
      )}

      <section className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[450px] lg:h-[55vh] lg:max-h-[600px] rounded-[2rem] overflow-hidden flex items-center p-6 sm:p-12 shadow-2xl border border-white/5">
        
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.img 
              key={currentImgIndex}
              src={HERO_IMAGES[currentImgIndex]} 
              alt={`Hero background ${currentImgIndex}`} 
              className="absolute inset-0 w-full h-full object-cover object-center sm:object-[center_10%] opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            />
          </AnimatePresence>
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl space-y-8 w-full">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[2.2rem] sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tighter uppercase mb-4 drop-shadow-2xl"
          >
            <Trans i18nKey="home.banner_title">
              АСПАН МЕН ЖЕР <br /> 
              <span className="text-[#ff4d00] whitespace-nowrap">АРАСЫНДА</span> — ТЕК МЕН <br />
              ҒАНА АСҚАҚПЫН
            </Trans>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <p className="text-white/40 text-sm sm:text-base lg:text-xl italic font-medium leading-relaxed max-w-2xl border-l-[3px] border-[#ff4d00] pl-6 py-1">
              "Throughout heaven and earth, I alone am the honored one."
            </p>
            <p className="text-[10px] sm:text-xs font-black text-[#ff4d00]/80 pl-7 uppercase tracking-[0.3em]" data-no-translate="true">
              — Satoru Gojo
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 pt-2"
          >
            <Link to="/movies" className="bg-[#ff4d00] text-white px-10 py-3 rounded-full font-bold text-sm uppercase tracking-widest text-center shadow-2xl shadow-[#ff4d00]/30 hover:scale-105 transition-all active:scale-95">
              {t('home.watch_movies')}
            </Link>
            <Link to="/anime" className="bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-3 rounded-full font-bold text-sm uppercase tracking-widest text-center hover:bg-white/10 transition-all active:scale-95">
              {t('home.watch_anime')}
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="px-3 sm:px-0 space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-2xl font-bold uppercase tracking-tight">{t('home.popular_movies')}</h2>
          <Link to="/movies" className="flex items-center gap-1 text-white/40 hover:text-white transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-widest">{t('home.all')}</span>
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
          <h2 className="text-2xl font-bold uppercase tracking-tight">{t('home.latest_anime')}</h2>
          <Link to="/anime" className="flex items-center gap-1 text-white/40 hover:text-white transition-colors">
            <span className="text-[10px] font-bold uppercase tracking-widest">{t('home.all')}</span>
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
