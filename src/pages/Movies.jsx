import React, { useEffect, useState } from 'react';
import { tmdbService } from '../services/tmdb.js';
import { MovieCard } from '../components/MovieCard.jsx';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Movies = () => {
  let [movies, setMovies] = useState([]);
  let [genres, setGenres] = useState([]);
  let [loading, setLoading] = useState(true);
  let [searchQuery, setSearchQuery] = useState('');
  let [selectedGenre, setSelectedGenre] = useState('');
  let [selectedYear, setSelectedYear] = useState('');
  let [page, setPage] = useState(1);
  let [error, setError] = useState(null);
  let [isDemo, setIsDemo] = useState(false);
  let { t, i18n } = useTranslation();

  let getTMDBLanguage = (lang) => {
    if (lang === 'en') return 'en-US';
    return 'ru-RU'; // Default for kk and ru
  };

  useEffect(() => {
    let fetchGenres = async () => {
      try {
        let tmdbLang = getTMDBLanguage(i18n.language);
        let data = await tmdbService.getGenres(tmdbLang);
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Failed to fetch genres', error);
      }
    };
    fetchGenres();
  }, [i18n.language]);

  let fetchMovies = async (query = '', p = 1, genre = '', year = '') => {
    setLoading(true);
    setError(null);
    try {
      let data1, data2;
      let p1 = p * 2 - 1;
      let p2 = p * 2;
      let tmdbLang = getTMDBLanguage(i18n.language);
      
      if (query) {
        data1 = await tmdbService.search(query, p1, tmdbLang);
        if (data1.total_pages >= p2) data2 = await tmdbService.search(query, p2, tmdbLang);
      } else if (genre || year) {
        let params1 = { page: p1, with_genres: genre, primary_release_year: year, language: tmdbLang };
        let params2 = { page: p2, with_genres: genre, primary_release_year: year, language: tmdbLang };
        data1 = await tmdbService.discover(params1);
        if (data1.total_pages >= p2) data2 = await tmdbService.discover(params2);
      } else {
        data1 = await tmdbService.getPopular(p1, tmdbLang);
        if (data1.total_pages >= p2) data2 = await tmdbService.getPopular(p2, tmdbLang);
      }
      
      let res1 = data1.results || [];
      let res2 = data2 ? (data2.results || []) : [];
      setMovies([...res1, ...res2]);
      setIsDemo(!!data1.is_demo);
    } catch (error) {
      console.error('Failed to fetch movies', error);
      setError(t('movies.fetch_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchQuery, page, selectedGenre, selectedYear);
  }, [page, selectedGenre, selectedYear, searchQuery, i18n.language]);

  let handleSearch = (e) => {
    e.preventDefault();
    if (page === 1 && selectedGenre === '' && selectedYear === '') {
      fetchMovies(searchQuery, 1, '', '');
    } else {
      setPage(1);
      setSelectedGenre('');
      setSelectedYear('');
    }
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight uppercase">{t('movies.title')}</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input 
              type="text" 
              placeholder={t('movies.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm sm:text-base"
            />
          </form>

          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={selectedGenre}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setSearchQuery('');
                setPage(1);
              }}
              className="bg-white/5 border border-white/10 rounded-full py-3 px-6 pr-10 focus:outline-none focus:border-[var(--color-accent)] transition-colors appearance-none cursor-pointer flex-1 sm:flex-none min-w-fit whitespace-nowrap text-sm sm:text-base"
            >
              <option value="" className="bg-[#0a0502]">{t('movies.all_genres')}</option>
              {genres.map(g => (
                <option key={g.id} value={g.id} className="bg-[#0a0502]">{g.name}</option>
              ))}
            </select>

            <input 
              type="number" 
              placeholder={t('movies.year')}
              min="1900"
              max="2026"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                setSearchQuery('');
                setPage(1);
              }}
              className="w-24 sm:w-28 bg-white/5 border border-white/10 rounded-full py-3 px-4 sm:px-6 focus:outline-none focus:border-[var(--color-accent)] transition-colors text-sm sm:text-base"
            />
          </div>
        </div>
      </div>

      {isDemo && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4 text-amber-400">
          <AlertCircle size={20} />
          <p className="text-sm">
            {t('movies.demo_alert')}
          </p>
        </div>
      )}

      {error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center space-y-4">
          <AlertCircle className="mx-auto text-red-400" size={48} />
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      ) : loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-[var(--color-accent)]" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}

      {!loading && !error && movies.length > 0 && (
        <div className="flex flex-row justify-center items-center gap-4 pt-8">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="glass px-6 py-2 rounded-full disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            {t('movies.prev')}
          </button>
          <span className="flex items-center font-mono font-bold text-white/60">{page}</span>
          <button 
            onClick={() => setPage(p => p + 1)}
            className="glass px-6 py-2 rounded-full hover:bg-white/10 transition-colors"
          >
            {t('movies.next')}
          </button>
        </div>
      )}
    </div>
  );
};
