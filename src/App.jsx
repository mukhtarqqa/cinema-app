import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth.jsx';
import { Navbar } from './components/Navbar.jsx';
import { Home } from './pages/Home.jsx';
import { useTranslation } from 'react-i18next';
import { Movies } from './pages/Movies.jsx';
import { AnimePage } from './pages/Anime.jsx';
import { Details } from './pages/Details.jsx';
import { Profile } from './pages/Profile.jsx';
import { Login } from './pages/Login.jsx';
import { ScrollToTop } from './components/ScrollToTop.jsx';

const App = () => {
  let { t } = useTranslation();
  return (
    <AuthProvider>
      <div className="min-h-screen relative overflow-x-hidden flex flex-col">
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
          <div className="atmosphere absolute top-[-10%] left-[-10%] w-[50%] h-[50%]" />
          <div className="atmosphere absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] opacity-40" />
        </div>

        <Navbar />
        
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/anime" element={<AnimePage />} />
            <Route path="/movie/:id" element={<Details type="movie" />} />
            <Route path="/anime/:id" element={<Details type="anime" />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        <footer className="py-12 border-t border-white/5 text-center text-white/40 text-sm">
          <p>© 2026 CINEMA HUB. TMDB {t('home.all').toLowerCase()} AniLibria.</p>
        </footer>

        <ScrollToTop />
      </div>
    </AuthProvider>
  );
};

export default App;
