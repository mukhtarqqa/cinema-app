import axios from 'axios';

let API_BASE = '/api/movies';

export let tmdbService = {
  getPopular: async (page = 1, language = 'ru-RU') => {
    const res = await axios.get(`${API_BASE}/popular`, { params: { page, language } });
    return res.data;
  },
  search: async (query, page = 1, language = 'ru-RU') => {
    const res = await axios.get(`${API_BASE}/search`, { params: { query, page, language } });
    return res.data;
  },
  getGenres: async (language = 'ru-RU') => {
    const res = await axios.get(`${API_BASE}/genres`, { params: { language } });
    return res.data;
  },
  discover: async (params) => {
    const res = await axios.get(`${API_BASE}/discover`, { params });
    return res.data;
  },
  getDetails: async (id, language = 'ru-RU') => {
    const res = await axios.get(`${API_BASE}/${id}`, { params: { language } });
    return res.data;
  }
};
