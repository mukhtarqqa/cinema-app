import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Film, Tv, User, LogOut, Mail, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar = () => {
  const { user, loginGoogle, logout } = useAuth();
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 px-6 flex items-center justify-between border-b border-white/5">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-[#ff4d00] rounded-lg flex items-center justify-center font-display font-bold text-xl group-hover:scale-110 transition-transform">C</div>
        <span className="font-display font-bold text-xl tracking-tight hidden sm:block">CINEMA HUB</span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-4">
        <NavLink to="/movies" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isActive ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
          <Film size={18} />
          <span className="hidden md:block font-medium text-sm">Фильмдер</span>
        </NavLink>
        <NavLink to="/anime" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isActive ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
          <Tv size={18} />
          <span className="hidden md:block font-medium text-sm">Аниме</span>
        </NavLink>
      </div>

      <div className="relative flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-2 bg-white/5 p-1 pl-3 rounded-full border border-white/10">
            <span className="text-xs font-medium text-white/60 hidden lg:block">{user.displayName || 'Пайдаланушы'}</span>
            <img 
              src={user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
              alt="user" 
              className="w-8 h-8 rounded-full border border-white/10 object-cover" 
            />
            <button 
              onClick={logout} 
              className="p-2 text-white/40 hover:text-red-500 transition-colors"
              title="Шығу"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <button 
              onClick={() => setShowAuthMenu(!showAuthMenu)} 
              className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-bold text-sm hover:bg-[#ff4d00] hover:text-white transition-all shadow-lg active:scale-95"
            >
              <User size={16} />
              <span>Кіру</span>
              <ChevronDown size={14} className={`transition-transform duration-300 ${showAuthMenu ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {showAuthMenu && (
                <>
                  <div className="fixed inset-0 z-[-1]" onClick={() => setShowAuthMenu(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                    animate={{ opacity: 1, y: 0, scale: 1 }} 
                    exit={{ opacity: 0, y: 15, scale: 0.95 }} 
                    className="absolute right-0 mt-4 w-64 bg-[#0f0f0f] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl"
                  >
                    <button 
                      onClick={() => { loginGoogle(); setShowAuthMenu(false); }} 
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                      Google арқылы кіру
                    </button>

                    <div className="h-px bg-white/5 my-1" />

                    <Link 
                      to="/login" 
                      onClick={() => setShowAuthMenu(false)} 
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#ff4d00]/10 text-[#ff4d00] hover:bg-[#ff4d00] hover:text-white transition-all text-sm font-bold"
                    >
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
