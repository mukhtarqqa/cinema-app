import React, { useEffect, useState, useRef } from 'react';
import { tmdbService } from '../services/tmdb.js';
import { MovieCard } from '../components/MovieCard.jsx';
import { Search, Loader2, AlertCircle, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

let TMDB_SORT_MAP = {
  popularity: 'popularity.desc',
  rating:     'vote_average.desc',
  newest:     'primary_release_date.desc',
  oldest:     'primary_release_date.asc',
};

export const Movies = () => {
  let [movies, setMovies] = useState([]);
  let [genres, setGenres] = useState([]);
  let [loading, setLoading] = useState(true);
  let [searchQuery, setSearchQuery] = useState('');
  let [selectedGenre, setSelectedGenre] = useState('');
  let [page, setPage] = useState(1);
  let [error, setError] = useState(null);
  let [isDemo, setIsDemo] = useState(false);
  let [sortBy, setSortBy] = useState('');
  let [filterOpen, setFilterOpen] = useState(false);
  let filterRef = useRef(null);
  let { t, i18n } = useTranslation();

  let getTMDBLanguage = (lang) => {
    if (lang === 'en') return 'en-US';
    return 'ru-RU';
  };

  useEffect(() => {
    let handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let fetchGenres = async () => {
      try {
        let tmdbLang = getTMDBLanguage(i18n.language);
        let data = await tmdbService.getGenres(tmdbLang);
        setGenres(data.genres || []);
      } catch (err) {
        console.error('Failed to fetch genres', err);
      }
    };
    fetchGenres();
  }, [i18n.language]);

  let fetchMovies = async (query = '', p = 1, genre = '', sort = '') => {
    setLoading(true);
    setError(null);
    try {
      let data1, data2;
      let p1 = p * 2 - 1;
      let p2 = p * 2;
      let tmdbLang = getTMDBLanguage(i18n.language);
      let tmdbSort = TMDB_SORT_MAP[sort] || 'popularity.desc';

      if (query) {
        data1 = await tmdbService.search(query, p1, tmdbLang);
        if (data1.total_pages >= p2) data2 = await tmdbService.search(query, p2, tmdbLang);
      } else {
        let params1 = { page: p1, with_genres: genre, language: tmdbLang, sort_by: tmdbSort };
        let params2 = { page: p2, with_genres: genre, language: tmdbLang, sort_by: tmdbSort };
        data1 = await tmdbService.discover(params1);
        if (data1.total_pages >= p2) data2 = await tmdbService.discover(params2);
      }

      let res1 = data1.results || [];
      let res2 = data2 ? (data2.results || []) : [];
      setMovies([...res1, ...res2]);
      setIsDemo(!!data1.is_demo);
    } catch (err) {
      console.error('Failed to fetch movies', err);
      setError(t('movies.fetch_error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(searchQuery, page, selectedGenre, sortBy);
  }, [page, selectedGenre, searchQuery, sortBy, i18n.language]);

  let handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchMovies(searchQuery, 1, selectedGenre, sortBy);
  };

  let sortOptions = [
    { value: 'popularity', label: t('filter.popularity') },
    { value: 'rating',     label: t('filter.rating')     },
    { value: 'newest',     label: t('filter.newest')     },
    { value: 'oldest',     label: t('filter.oldest')     },
  ];

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

            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen(o => !o)}
                title={t('filter.title')}
                className={`flex items-center justify-center w-12 h-12 rounded-full border transition-colors ${
                  sortBy
                    ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-white'
                }`}
              >
                <SlidersHorizontal size={18} />
              </button>

              {filterOpen && (
                <div className="absolute right-0 top-14 z-50 min-w-[190px] bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-2 text-xs text-white/40 uppercase tracking-widest border-b border-white/10">
                    {t('filter.title')}
                  </div>
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSortBy(prev => prev === opt.value ? '' : opt.value);
                        setPage(1);
                        setFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-white/10 ${
                        sortBy === opt.value ? 'text-[var(--color-accent)] font-bold' : 'text-white/80'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isDemo && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4 text-amber-400">
          <AlertCircle size={20} />
          <p className="text-sm">{t('movies.demo_alert')}</p>
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
