import React, { useEffect, useState, useRef } from 'react';
import { anilibriaService } from '../services/anilibria.js';
import { AnimeCard } from '../components/AnimeCard.jsx';
import { Search, Loader2, SlidersHorizontal } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AnimePage = () => {
  let [animes, setAnimes] = useState([]);
  let [genres, setGenres] = useState([]);
  let [loading, setLoading] = useState(true);
  let [searchQuery, setSearchQuery] = useState('');
  let [selectedGenre, setSelectedGenre] = useState('');
  let [page, setPage] = useState(1);
  let [totalPages, setTotalPages] = useState(1);
  let [sortBy, setSortBy] = useState('');
  let [filterOpen, setFilterOpen] = useState(false);
  let filterRef = useRef(null);
  let { t } = useTranslation();

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
        let data = await anilibriaService.getGenres();
        setGenres(data || []);
      } catch (err) {
        console.error('Failed to fetch genres', err);
      }
    };
    fetchGenres();
  }, []);

  let fetchAnime = async (query = '', p = 1, genreId = '') => {
    setLoading(true);
    try {
      let result;
      if (query) {
        let data = await anilibriaService.search(query);
        result = { data: data, totalPages: 1 };
      } else {
        result = await anilibriaService.getReleases(p, 24, genreId || null);
      }
      setAnimes(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch anime', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime(searchQuery, page, selectedGenre);
  }, [page, selectedGenre, searchQuery]);

  let handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAnime(searchQuery, 1, selectedGenre);
  };

  let sortedAnimes = [...animes];
  if (sortBy === 'favorites') {
    // Already sorted / no action needed
  } else if (sortBy === 'likes') {
    sortedAnimes.sort((a, b) => (Number(b.added_in_users_favorites) || 0) - (Number(a.added_in_users_favorites) || 0));
  } else if (sortBy === 'newest') {
    sortedAnimes.sort((a, b) => {
      let idDiff = (Number(b.id) || 0) - (Number(a.id) || 0);
      if (idDiff !== 0) return idDiff;
      return (Number(b.year) || 0) - (Number(a.year) || 0);
    });
  } else if (sortBy === 'oldest') {
    sortedAnimes.sort((a, b) => {
      let idDiff = (Number(a.id) || 0) - (Number(b.id) || 0);
      if (idDiff !== 0) return idDiff;
      return (Number(a.year) || 0) - (Number(b.year) || 0);
    });
  }

  let sortOptions = [
    { value: 'favorites', label: t('anime_filter.favorites') },
    { value: 'likes',     label: t('anime_filter.likes')     },
    { value: 'newest',    label: t('anime_filter.newest')    },
    { value: 'oldest',    label: t('anime_filter.oldest')    },
  ];

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight uppercase">{t('anime.title')}</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input
              type="text"
              placeholder={t('anime.search')}
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
                setPage(1);
              }}
              className="bg-white/5 border border-white/10 rounded-full py-3 px-6 pr-10 focus:outline-none focus:border-[var(--color-accent)] transition-colors appearance-none cursor-pointer flex-1 sm:w-auto min-w-fit whitespace-nowrap text-sm sm:text-base"
            >
              <option value="" className="bg-[#0a0502]">{t('anime.all_genres')}</option>
              {genres.map((g, idx) => {
                const name = typeof g === 'string' ? g : g.name;
                const id = typeof g === 'string' ? idx : g.id;
                return (
                  <option key={id} value={id} className="bg-[#0a0502]">{name}</option>
                );
              })}
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

      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-[var(--color-accent)]" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {sortedAnimes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}

      {!loading && sortedAnimes.length === 0 && (
        <div className="h-[50vh] flex items-center justify-center text-white/40 text-center px-4">
          {t('anime.not_found')}
        </div>
      )}

      {!loading && sortedAnimes.length > 0 && !searchQuery && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="glass w-full sm:w-auto px-8 py-3 rounded-full font-bold disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            {t('anime.prev')}
          </button>
          <span className="font-mono text-white/60">
            {t('anime.page')} {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="glass w-full sm:w-auto px-8 py-3 rounded-full font-bold disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            {t('anime.next')}
          </button>
        </div>
      )}
    </div>
  );
};
