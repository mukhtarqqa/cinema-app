import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Film, Tv, Heart, User, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user, login, logout } = useAuth();

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

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-white/20" />
            <button onClick={logout} className="p-2 text-white/60 hover:text-white transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button onClick={login} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-white/90 transition-colors">
            <User size={18} />
            <span>Кіру</span>
          </button>
        )}
      </div>
    </nav>
  );
};
