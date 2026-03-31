import React, { useEffect, useState } from 'react';
import { anilibriaService } from '../services/anilibria.js';
import { AnimeCard } from '../components/AnimeCard.jsx';
import { Search, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const AnimePage = () => {
  let [animes, setAnimes] = useState([]);
  let [genres, setGenres] = useState([]);
  let [loading, setLoading] = useState(true);
  let [searchQuery, setSearchQuery] = useState('');
  let [selectedGenre, setSelectedGenre] = useState('');
  let [page, setPage] = useState(1);
  let [totalPages, setTotalPages] = useState(1);
  let { t } = useTranslation();

  useEffect(() => {
    let fetchGenres = async () => {
      try {
        let data = await anilibriaService.getGenres();
        setGenres(data || []);
      } catch (error) {
        console.error('Failed to fetch genres', error);
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
        result = await anilibriaService.getReleases(p, 48, genreId || null);
      }
      setAnimes(result.data || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch anime', error);
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

  const filteredAnimes = animes;

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

          <select 
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setPage(1);
            }}
            className="bg-white/5 border border-white/10 rounded-full py-3 px-6 pr-10 focus:outline-none focus:border-[var(--color-accent)] transition-colors appearance-none cursor-pointer w-full sm:w-auto min-w-fit whitespace-nowrap text-sm sm:text-base"
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
        </div>
      </div>

      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-[var(--color-accent)]" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredAnimes.map((anime) => (
            <AnimeCard key={anime.id} anime={anime} />
          ))}
        </div>
      )}

      {!loading && filteredAnimes.length === 0 && (
        <div className="h-[50vh] flex items-center justify-center text-white/40 text-center px-4">
          {t('anime.not_found')}
        </div>
      )}

      {!loading && filteredAnimes.length > 0 && !searchQuery && (
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
