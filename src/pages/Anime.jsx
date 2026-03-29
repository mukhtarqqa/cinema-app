import React, { useEffect, useState } from 'react';
import { anilibriaService } from '../services/anilibria.js';
import { AnimeCard } from '../components/AnimeCard.jsx';
import { Search, Loader2 } from 'lucide-react';

export const AnimePage = () => {
  const [animes, setAnimes] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await anilibriaService.getGenres();
        setGenres(data || []);
      } catch (error) {
        console.error('Failed to fetch genres', error);
      }
    };
    fetchGenres();
  }, []);

  const fetchAnime = async (query = '', p = 1, genreId = '') => {
    setLoading(true);
    try {
      let result;
      if (query) {
        const data = await anilibriaService.search(query);
        result = { data, totalPages: 1 };
      } else {
        result = await anilibriaService.getReleases(p, 24, genreId || null);
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

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchAnime(searchQuery, 1, selectedGenre);
  };

  const filteredAnimes = animes; // Server-side filtering now

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-4xl font-display font-bold tracking-tight uppercase">АНИМЕ</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <form onSubmit={handleSearch} className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={20} />
            <input 
              type="text" 
              placeholder="Аниме іздеу..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 focus:outline-none focus:border-[var(--color-accent)] transition-colors"
            />
          </form>

          <select 
            value={selectedGenre}
            onChange={(e) => {
              setSelectedGenre(e.target.value);
              setPage(1);
            }}
            className="bg-white/5 border border-white/10 rounded-full py-3 px-6 focus:outline-none focus:border-[var(--color-accent)] transition-colors appearance-none cursor-pointer min-w-[160px]"
          >
            <option value="" className="bg-[#0a0502]">Барлық жанрлар</option>
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
        <div className="h-[50vh] flex items-center justify-center text-white/40">
          Іздеуге немесе жанрға сәйкес аниме табылмады.
        </div>
      )}

      {!loading && filteredAnimes.length > 0 && !searchQuery && (
        <div className="flex justify-center items-center gap-6 pt-8">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="glass px-8 py-3 rounded-full font-bold disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            Алдыңғы
          </button>
          <span className="font-mono text-white/60">
            Бет {page} / {totalPages}
          </span>
          <button 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="glass px-8 py-3 rounded-full font-bold disabled:opacity-30 hover:bg-white/10 transition-colors"
          >
            Келесі
          </button>
        </div>
      )}
    </div>
  );
};
