import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

async function startServer() {
  let app = express();
  let PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  let TMDB_API_KEY = process.env.TMDB_API_KEY;
  let TMDB_BASE_URL = 'https://api.themoviedb.org/3';

  let MOCK_MOVIES = [
    { id: 1, title: 'Interstellar', poster_path: '/gEU2QniE6E77NI6lCU6MxlvWiIx.jpg', vote_average: 8.4, release_date: '2014-11-05', overview: 'The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.' },
    { id: 2, title: 'Inception', poster_path: '/ljsZTbVsrYqSKSdv9pOE9pGPpB7.jpg', vote_average: 8.3, release_date: '2010-07-15', overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: 'inception', the implantation of another person's idea into a target's subconscious." },
    { id: 3, title: 'The Dark Knight', poster_path: '/qJ2tW6WMUDr9s1DvdmtbrpIu9B2.jpg', vote_average: 8.5, release_date: '2008-07-16', overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets. The partnership proves to be effective, but they soon find themselves prey to a reign of chaos unleashed by a rising criminal mastermind known to the terrified citizens of Gotham as the Joker.' },
    { id: 4, title: 'Pulp Fiction', poster_path: '/d5iIlSXY9CptiD0JaGpf6fzhwYl.jpg', vote_average: 8.5, release_date: '1994-09-10', overview: 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper. Their adventures unfurl in three stories that weave in and out of each other.' },
    { id: 5, title: 'The Matrix', poster_path: '/f89U3Y9SJuCYFJj7lbGv6fB01pI.jpg', vote_average: 8.2, release_date: '1999-03-30', overview: 'Set in the 22nd century, The Matrix tells the story of a computer hacker who joins a group of underground insurgents fighting the vast and powerful computers who now rule the earth.' },
    { id: 6, title: 'Fight Club', poster_path: '/pB8BM7pdv9Gv9pI9uI9uI9uI9uI.jpg', vote_average: 8.4, release_date: '1999-10-15', overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground "fight clubs" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.' }
  ];

  let hasValidKey = () => {
    return TMDB_API_KEY && TMDB_API_KEY !== 'YOUR_TMDB_API_KEY';
  };

  app.get('/api/movies/popular', async (req, res) => {
    const getMockPopular = () => ({ results: MOCK_MOVIES, total_pages: 1, total_results: MOCK_MOVIES.length, is_demo: true });
    if (!hasValidKey()) {
      return res.json(getMockPopular());
    }
    try {
      let response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: { 
          api_key: TMDB_API_KEY, 
          language: req.query.language || 'ru-RU', 
          page: req.query.page || 1 
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error('TMDB Popular Error:', error.message);
      res.json(getMockPopular());
    }
  });

  app.get('/api/movies/search', async (req, res) => {
    const getMockSearch = () => {
      const query = (req.query.query || '').toLowerCase();
      const filtered = MOCK_MOVIES.filter(m => m.title.toLowerCase().includes(query));
      return { results: filtered, total_pages: 1, total_results: filtered.length, is_demo: true };
    };
    if (!hasValidKey()) {
      return res.json(getMockSearch());
    }
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: { 
          api_key: TMDB_API_KEY, 
          query: req.query.query, 
          language: req.query.language || 'ru-RU', 
          page: req.query.page || 1 
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error('TMDB Search Error:', error.message);
      res.json(getMockSearch());
    }
  });

  app.get('/api/movies/genres', async (req, res) => {
    const mockGenres = { genres: [{ id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' }, { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }, { id: 878, name: 'Science Fiction' }] };
    if (!hasValidKey()) {
      return res.json(mockGenres);
    }
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
        params: { 
          api_key: TMDB_API_KEY, 
          language: req.query.language || 'ru-RU' 
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error('TMDB Genres Error:', error.message);
      res.json(mockGenres);
    }
  });

  app.get('/api/movies/discover', async (req, res) => {
    const getMockDiscover = () => {
      let filtered = [...MOCK_MOVIES];
      if (req.query.with_genres) {
        filtered = filtered.filter(m => m.id % 2 === 0);
      }
      if (req.query.primary_release_year) {
        filtered = filtered.filter(m => m.release_date.startsWith(req.query.primary_release_year));
      }
      return { results: filtered, total_pages: 1, total_results: filtered.length, is_demo: true };
    };

    if (!hasValidKey()) {
      return res.json(getMockDiscover());
    }
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: { 
          api_key: TMDB_API_KEY, 
          language: req.query.language || 'ru-RU', 
          page: req.query.page || 1,
          with_genres: req.query.with_genres,
          primary_release_year: req.query.primary_release_year,
          sort_by: req.query.sort_by || 'popularity.desc'
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error('TMDB Discover Error:', error.message);
      res.json(getMockDiscover());
    }
  });

  app.get('/api/movies/:id', async (req, res) => {
    const getMockDetails = () => {
      const movie = MOCK_MOVIES.find(m => m.id === Number(req.params.id));
      if (movie) return { ...movie, videos: [], genres: [{ id: 1, name: 'Demo' }], runtime: 120, is_demo: true };
      return null;
    };
    if (!hasValidKey()) {
      let movie = getMockDetails();
      if (movie) return res.json(movie);
      return res.status(404).json({ error: 'Movie not found in demo mode' });
    }
    try {
      let tmdbLang = req.query.language || 'ru-RU';
      let [details, videos] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/movie/${req.params.id}`, { 
          params: { 
            api_key: TMDB_API_KEY, 
            language: tmdbLang 
          } 
        }),
        axios.get(`${TMDB_BASE_URL}/movie/${req.params.id}/videos`, { 
          params: { 
            api_key: TMDB_API_KEY, 
            language: tmdbLang 
          } 
        })
      ]);
      res.json({ ...details.data, videos: videos.data.results });
    } catch (error) {
      console.error('TMDB Details Error:', error.message);
      const movie = getMockDetails();
      if (movie) return res.json(movie);
      res.status(error.response?.status || 500).json({ 
        error: 'Failed to fetch movie details',
        details: error.message 
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('/{*path}', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  app.use('/api', (err, req, res, next) => { // eslint-disable-line no-unused-vars
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
  });
}

startServer();
