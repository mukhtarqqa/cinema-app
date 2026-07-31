import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { Film, Tv, LogOut, Mail, Globe, Menu, Heart, Clock, User, X } from 'lucide-react';
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

  let langLabels = { kk: 'ҚАЗ', ru: 'РУС', en: 'ENG' };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 px-4 sm:px-6 flex items-center justify-between border-b border-white/5"
      style={{ background: 'rgba(10,5,2,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 group shrink-0">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-bold text-xl group-hover:scale-110 transition-transform glow-accent"
          style={{ background: 'linear-gradient(135deg, #ff4d00, #ff8c42)' }}
        >
          C
        </div>
        <span className="font-display font-bold text-lg tracking-tight hidden sm:block">
          CINEMA <span className="gradient-text">HUB</span>
        </span>
      </Link>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        <NavLink
          to="/movies"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-[#ff4d00]/15 text-[#ff4d00] border border-[#ff4d00]/20'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`
          }
        >
          <Film size={16} />
          <span className="hidden md:block">{t('navbar.movies')}</span>
        </NavLink>
        <NavLink
          to="/anime"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              isActive
                ? 'bg-[#ff4d00]/15 text-[#ff4d00] border border-[#ff4d00]/20'
                : 'text-white/50 hover:text-white hover:bg-white/5'
            }`
          }
        >
          <Tv size={16} />
          <span className="hidden md:block">{t('navbar.anime')}</span>
        </NavLink>
      </div>

      {/* Right side */}
      <div className="relative flex items-center gap-2 sm:gap-3">
        {/* Language toggle */}
        <button
          onClick={toggleLang}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white/70 hover:text-white"
          title="Тілді ауыстыру"
        >
          <Globe size={14} />
          <span className="text-[11px] font-bold tracking-wider">{langLabels[i18n.language] || i18n.language.toUpperCase()}</span>
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center justify-center w-9 h-9 hover:bg-white/5 rounded-full transition-colors active:scale-95 border border-white/10"
          >
            {user ? (
              <img
                src={user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                className="w-7 h-7 rounded-full object-cover"
                alt="User"
              />
            ) : (
              showMenu ? <X size={18} className="text-white" /> : <Menu size={18} className="text-white" />
            )}
          </button>

          <AnimatePresence>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-[-1]" onClick={() => setShowMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  className="absolute right-0 mt-3 w-64 rounded-2xl p-2 shadow-2xl border border-white/10 overflow-hidden"
                  style={{ background: 'rgba(15,12,10,0.97)', backdropFilter: 'blur(30px)' }}
                >
                  {user ? (
                    <>
                      {/* User info header */}
                      <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl bg-white/5">
                        <img
                          src={user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                          alt="user"
                          className="w-10 h-10 rounded-full border-2 border-[#ff4d00]/40"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{user.displayName || t('profile.user_placeholder')}</p>
                          <p className="text-xs text-white/40 truncate">{user.email}</p>
                        </div>
                      </div>

                      {[
                        { icon: User, label: t('profile.profile'), tab: 'history' },
                        { icon: Clock, label: t('profile.watch_later'), tab: 'watchLater' },
                        { icon: Heart, label: t('profile.favorites'), tab: 'favorites' },
                      ].map(({ icon: Icon, label, tab }) => (
                        <button
                          key={tab}
                          onClick={() => { setShowMenu(false); navigate(`/profile?tab=${tab}`); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium text-white/80 hover:text-white"
                        >
                          <Icon size={16} className="text-white/40" /> {label}
                        </button>
                      ))}

                      <div className="h-px bg-white/5 my-1 mx-2" />

                      <button
                        onClick={() => { logout(); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 text-red-400 transition-colors text-sm font-bold"
                      >
                        <LogOut size={16} /> {t('navbar.logout')}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-3 mb-1">
                        <p className="text-xs text-white/40 font-medium uppercase tracking-wider">{t('navbar.login_email')}</p>
                      </div>
                      <button
                        onClick={() => { loginGoogle(); setShowMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-all text-sm font-semibold"
                      >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
                        {t('navbar.login_google')}
                      </button>
                      <div className="h-px bg-white/5 my-1 mx-2" />
                      <Link
                        to="/login"
                        onClick={() => setShowMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-[#ff4d00] hover:bg-[#ff4d00] hover:text-white"
                      >
                        <Mail size={16} />
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
