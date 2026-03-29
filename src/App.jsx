import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Home } from './pages/Home.jsx';
import { Movies } from './pages/Movies.jsx';
import { AnimePage } from './pages/Anime.jsx';
import { Details } from './pages/Details.jsx';
import { Favorites } from './pages/Favorites.jsx';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen relative overflow-x-hidden">
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="atmosphere absolute top-[-10%] left-[-10%] w-[50%] h-[50%]" />
          <div className="atmosphere absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] opacity-40" />
        </div>

        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/anime" element={<AnimePage />} />
          <Route path="/movie/:id" element={<Details type="movie" />} />
          <Route path="/anime/:id" element={<Details type="anime" />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>

        <footer className="py-12 border-t border-white/5 text-center text-white/40 text-sm">
          <p>© 2026 CINEMA HUB. TMDB мен AniLibria арқылы жұмыс істейді.</p>
        </footer>
      </div>
    </AuthProvider>
  );
};

export default App;
