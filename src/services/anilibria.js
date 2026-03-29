import axios from 'axios';

const API_BASE = 'https://anilibria.top/api/v1';

export const anilibriaService = {
  getLatest: async (limit = 20) => {
    try {
      const res = await axios.get(`${API_BASE}/anime/releases/latest`, { params: { limit } });
      return res.data;
    } catch (error) {
      console.error('Anilibria Latest Error:', error.message);
      return [];
    }
  },
  getReleases: async (page = 1, limit = 24, genreId = null) => {
    try {
      let url = `${API_BASE}/anime/catalog/releases`;
      const params = {
        limit,
        page,
      };

      if (genreId) {
        url = `${API_BASE}/anime/genres/${genreId}/releases`;
      }

      const res = await axios.get(url, { params });
      // Both endpoints return { data: Array, meta: { pagination: { total_pages: number } } }
      return {
        data: res.data.data || [],
        totalPages: res.data.meta?.pagination?.total_pages || 1
      };
    } catch (error) {
      console.error('Anilibria Releases Error:', error.message);
      return { data: [], totalPages: 1 };
    }
  },
  search: async (query) => {
    if (!query || query.trim().length < 2) return [];
    try {
      const res = await axios.get(`${API_BASE}/app/search/releases`, { params: { query: query.trim() } });
      // Search returns a plain array
      return res.data || [];
    } catch (error) {
      console.error('Anilibria Search Error:', error.message);
      return [];
    }
  },
  getDetails: async (id) => {
    if (!id) return null;
    try {
      const res = await axios.get(`${API_BASE}/anime/releases/${id}`);
      return res.data;
    } catch (error) {
      console.error('Anilibria Details Error:', error.message);
      return null;
    }
  },
  getGenres: async () => {
    try {
      const res = await axios.get(`${API_BASE}/anime/genres`);
      return res.data;
    } catch (error) {
      console.error('Anilibria Genres Error:', error.message);
      return [
        { id: 1, name: 'Экшен' },
        { id: 2, name: 'Комедия' },
        { id: 3, name: 'Драма' },
        { id: 4, name: 'Фэнтези' },
        { id: 5, name: 'Приключения' },
        { id: 6, name: 'Романтика' },
        { id: 7, name: 'Сёнен' },
        { id: 8, name: 'Сейнен' }
      ];
    }
  }
};
