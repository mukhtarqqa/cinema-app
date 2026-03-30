import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Film, Tv, Heart, User, LogOut, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const { user, login, loginApple, logout } = useAuth();
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center font-display font-bold text-xl">
          C
        </div>
        <span className="font-display font-bold text-xl tracking-tight hidden sm:block">CINEMA HUB</span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-4">
        <NavLink to="/movies" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}>
          <Film size={18} />
          <span className="hidden md:block">Фильмдер</span>
        </NavLink>
        <NavLink to="/anime" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}>
          <Tv size={18} />
          <span className="hidden md:block">Аниме</span>
        </NavLink>
        {user && (
          <NavLink to="/favorites" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white'}`}>
            <Heart size={18} />
            <span className="hidden md:block">Таңдаулылар</span>
          </NavLink>
        )}
      </div>

      <div className="relative flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-white/20" />
            <button onClick={logout} className="p-2 text-white/60 hover:text-white transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setShowAuthMenu(!showAuthMenu)} 
              className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-white/90 transition-colors"
            >
              <User size={18} />
              <span>Кіру</span>
            </button>

            {/* ВЫПАДАЮЩЕЕ МЕНЮ ВЫБОРА ВХОДА */}
            <AnimatePresence>
              {showAuthMenu && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setShowAuthMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-[#1a1a1a] border border-white/10 rounded-2xl p-2 shadow-2xl"
                  >
                    <button 
                      onClick={() => { login(); setShowAuthMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                      Google-мен кіру
                    </button>
                    
                    <button 
                      onClick={() => { loginApple(); setShowAuthMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                      <svg className="w-5 h-5 fill-white" viewBox="0 0 384 512"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
                      Apple-мен кіру
                    </button>

                    <div className="h-px bg-white/5 my-1" />

                    <Link 
                      to="/login" 
                      onClick={() => setShowAuthMenu(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                      <Mail size={18} className="text-white/60" />
                      Email-мен кіру
                    </Link>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </nav>
  );
};
