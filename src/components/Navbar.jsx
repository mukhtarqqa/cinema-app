import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Film, Tv, LogOut, Mail, Globe, Menu, Heart, Clock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from 'react-i18next';

export let Navbar = () => {
  let { user, loginGoogle, logout } = useAuth();
  let [showMenu, setShowMenu] = useState(false);
  let navigate = useNavigate();
  let { t, i18n } = useTranslation();

  let toggleLang = () => {
    let langs = ['kk', 'ru', 'en'];
    let currentIndex = langs.indexOf(i18n.language);
    let nextIndex = (currentIndex + 1) % langs.length;
    i18n.changeLanguage(langs[nextIndex]);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 px-6 flex items-center justify-between border-b border-white/5">
      <Link to="/" className="flex items-center gap-2 group">
        <div className="w-8 h-8 bg-[#ff4d00] rounded-lg flex items-center justify-center font-display font-bold text-xl group-hover:scale-110 transition-transform">C</div>
        <span className="font-display font-bold text-xl tracking-tight hidden sm:block">CINEMA HUB</span>
      </Link>

      <div className="flex items-center gap-1 sm:gap-4">
        <NavLink to="/movies" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isActive ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
          <Film size={18} />
          <span className="hidden md:block font-medium text-sm">{t('navbar.movies')}</span>
        </NavLink>
        <NavLink to="/anime" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-full transition-all ${isActive ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
          <Tv size={18} />
          <span className="hidden md:block font-medium text-sm">{t('navbar.anime')}</span>
        </NavLink>
      </div>

      <div className="relative flex items-center gap-4">
        <button onClick={toggleLang} className="flex items-center gap-1 text-white/60 hover:text-white transition-colors" title="Тілді ауыстыру / Сменить язык">
          <Globe size={18} />
          <span className="text-xs font-bold uppercase">{i18n.language}</span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="flex items-center justify-center w-10 h-10 hover:bg-white/5 rounded-full transition-colors active:scale-95"
          >
            {user ? (
               <img src={user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} className="w-7 h-7 rounded-full border border-white/20 object-cover" alt="User" />
            ) : (
               <Menu size={24} className="text-white" />
            )}
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 15, scale: 0.95 }} 
                  className="absolute right-0 mt-4 w-64 bg-[#0f0f0f] border border-white/10 rounded-2xl p-2 shadow-2xl backdrop-blur-xl"
                >
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-3 py-3 border-b border-white/5 mb-1">
                         <img src={user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} alt="user" className="w-10 h-10 rounded-full" />
                         <div className="flex-1 min-w-0">
                           <p className="font-bold text-sm truncate">{user.displayName || 'Пайдаланушы'}</p>
                           <p className="text-xs text-white/40 truncate">{user.email}</p>
                         </div>
                      </div>

                      <button 
                        onClick={() => { setShowMenu(false); navigate('/profile?tab=history'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
                      >
                        <User size={18} /> Профиль
                      </button>

                      <button 
                        onClick={() => { setShowMenu(false); navigate('/profile?tab=watchLater'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
                      >
                        <Clock size={18} /> Посмотреть позже
                      </button>
                      
                      <button 
                        onClick={() => { setShowMenu(false); navigate('/profile?tab=favorites'); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
                      >
                        <Heart size={18} /> Избранное
                      </button>

                      <div className="h-px bg-white/5 my-1" />

                      <button 
                        onClick={() => { logout(); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-colors text-sm font-bold"
                      >
                        <LogOut size={18} /> {t('navbar.logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => { loginGoogle(); setShowMenu(false); }} 
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
                      >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                        {t('navbar.login_google')}
                      </button>
                      <div className="h-px bg-white/5 my-1" />
                      <Link 
                        to="/login" 
                        onClick={() => setShowMenu(false)} 
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-[#ff4d00]/10 text-[#ff4d00] hover:bg-[#ff4d00] hover:text-white transition-all text-sm font-bold"
                      >
                        <Mail size={18} />
                        {t('navbar.login_email')}
                      </Link>
                    </>
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};
