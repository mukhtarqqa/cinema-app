import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Film, Tv, Heart, User, LogOut, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const { user, login, logout } = useAuth();
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 px-6 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-[var(--color-accent)] rounded-lg flex items-center justify-center font-display font-bold text-xl">C</div>
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
      </div>

      <div className="relative flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <img src={user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt="user" className="w-8 h-8 rounded-full border border-white/20" />
            <button onClick={logout} className="p-2 text-white/60 hover:text-white transition-colors"><LogOut size={20} /></button>
          </div>
        ) : (
          <div className="relative">
            <button onClick={() => setShowAuthMenu(!showAuthMenu)} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-white/90 transition-colors">
              <User size={18} />
              <span>Кіру</span>
            </button>

            <AnimatePresence>
              {showAuthMenu && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setShowAuthMenu(false)} />
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute right-0 mt-3 w-64 bg-[#1a1a1a] border border-white/10 rounded-[2rem] p-2 shadow-2xl overflow-hidden">
                    <button onClick={() => { login(); setShowAuthMenu(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors text-sm font-medium">
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                      Google арқылы
                    </button>
                    
                    <Link to="/login" onClick={() => setShowAuthMenu(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 transition-colors text-sm font-medium">
                      <Phone size={18} className="text-white/60" />
                      Телефон арқылы
                    </Link>

                    <div className="h-px bg-white/5 my-1" />

                    <Link to="/login" onClick={() => setShowAuthMenu(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 hover:bg-[#ff4d00] transition-all text-sm font-bold">
                      <Mail size={18} />
                      Email / Тіркелу
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
