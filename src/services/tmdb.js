import axios from 'axios';

const API_BASE = '/api/movies';

export const tmdbService = {
  getPopular: async (page = 1) => {
    const res = await axios.get(`${API_BASE}/popular`, { params: { page } });
    return res.data;
  },
  search: async (query, page = 1) => {
    const res = await axios.get(`${API_BASE}/search`, { params: { query, page } });
    return res.data;
  },
  getGenres: async () => {
    const res = await axios.get(`${API_BASE}/genres`);
    return res.data;
  },
  discover: async (params) => {
    const res = await axios.get(`${API_BASE}/discover`, { params });
    return res.data;
  },
  getDetails: async (id) => {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data;
  }
};
