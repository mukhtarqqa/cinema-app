import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { db, storage } from '../firebase.js';
import { collection, query, where, onSnapshot, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Loader2, Clock, History, Star, User, LogOut, Camera, Trash2, Edit2, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const Profile = () => {
  let { user, loading: authLoading, logout, updateUserProfile } = useAuth();
  let [searchParams, setSearchParams] = useSearchParams();
  let activeTab = searchParams.get('tab') || 'history';
  let [data, setData] = useState([]);
  let [loadingData, setLoadingData] = useState(false);
  let [uploading, setUploading] = useState(false);
  let [isEditingName, setIsEditingName] = useState(false);
  let [newName, setNewName] = useState('');
  let { t } = useTranslation();

  const handleClearHistory = async () => {
    if (window.confirm(t('profile.confirm_clear_history'))) {
      try {
        setLoadingData(true);
        await Promise.all(data.map(item => deleteDoc(doc(db, 'history', item.id))));
      } catch (error) {
        console.error('Error clearing history:', error);
      } finally {
        setLoadingData(false);
      }
    }
  };

  useEffect(() => {
    if (user) setNewName(user.displayName || '');
  }, [user]);

  const handleSaveName = async () => {
    if (newName.trim() && newName !== user.displayName) {
      await updateUserProfile({ displayName: newName.trim() });
    }
    setIsEditingName(false);
  };

  const handleAvatarChange = async (e) => {
    let file = e.target.files[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      let storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      let url = await getDownloadURL(storageRef);
      await updateUserProfile({ photoURL: url });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка при загрузке фото. Проверьте правила Storage.');
    } finally {
      setUploading(false);
    }
  };

  const tabs = [
    { id: 'history', icon: History, label: t('profile.history') },
    { id: 'watchLater', icon: Clock, label: t('profile.watch_later') },
    { id: 'favorites', icon: Heart, label: t('profile.favorites') },
    { id: 'reviews', icon: Star, label: t('profile.my_reviews') },
  ];

  useEffect(() => {
    if (!user) return;
    setLoadingData(true);
    let collName = activeTab; // 'history', 'watchLater', 'favorites', 'reviews'
    let orderField = 'createdAt';
    if (activeTab === 'watchLater') orderField = 'addedAt';
    if (activeTab === 'history') orderField = 'watchedAt';

    let q = query(
      collection(db, collName),
      where('uid', '==', user.uid),
      orderBy(orderField, 'desc')
    );

    let unsub = onSnapshot(q, (snapshot) => {
      setData(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingData(false);
    });

    return () => unsub();
  }, [user, activeTab]);

  if (authLoading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-[var(--color-accent)]" size={48} />
    </div>
  );

  if (!user) return (
    <div className="pt-40 text-center space-y-4">
      <h1 className="text-3xl font-display font-bold uppercase">{t('profile.login_required')}</h1>
      <Link to="/" className="inline-block bg-[var(--color-accent)] px-6 py-2 rounded-full font-bold uppercase">{t('profile.go_home')}</Link>
    </div>
  );

  const ItemCard = ({ item }) => {
    let contentType = item.contentType || 'movie';
    let id = item.itemId || item.contentId;
    let title = item.title;
    let poster = item.posterPath || item.poster;
    let posterUrl = poster 
      ? (poster.startsWith('http') || poster.startsWith('blob') ? poster : (contentType === 'movie' ? `https://image.tmdb.org/t/p/w500${poster}` : `https://anilibria.top${poster}`))
      : 'https://picsum.photos/seed/movie/500/750';

    let titleStr = typeof title === 'string' ? title : (title?.main || title?.en || 'Без названия');

    return (
      <motion.div 
        whileHover={{ y: -8 }}
        className="group relative aspect-[2/3] rounded-2xl overflow-hidden glass"
      >
        <Link to={`/${contentType}/${id}`}>
          <img 
            src={posterUrl} 
            alt={titleStr} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
            <h3 className="font-display font-bold text-lg leading-tight mb-1 uppercase text-white">{titleStr}</h3>
            <span className="text-xs uppercase font-bold tracking-widest text-[var(--color-accent)]">{contentType === 'movie' ? t('profile.movie') : t('profile.anime')}</span>
          </div>
        </Link>
      </motion.div>
    );
  };

  const ReviewCard = ({ review }) => {
    const handleDeleteReview = async (e) => {
      e.preventDefault();
      if (window.confirm("Удалить отзыв?")) {
        try {
          await deleteDoc(doc(db, 'reviews', review.id));
        } catch (error) {
          console.error("Error deleting review:", error);
          alert("Не удалось удалить отзыв.");
        }
      }
    };

    return (
      <div className="glass p-5 rounded-3xl space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Link to={`/${review.contentType}/${review.contentId || review.itemId}`} className="hover:text-[var(--color-accent)] font-bold text-lg transition-colors">
            {t('profile.movie_link')}
          </Link>
          <div className="flex items-center gap-1 text-yellow-400 font-bold shrink-0 text-sm">
            <Star size={14} fill="currentColor" />
            <span>{review.rating}</span>
          </div>
        </div>
        <p className="text-white/80 text-sm leading-relaxed break-words">{review.text}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[10px] text-white/40">{review.createdAt?.toDate().toLocaleDateString()}</p>
          <button onClick={handleDeleteReview} className="p-2 text-white/40 hover:text-red-500 transition-colors bg-white/5 rounded-full hover:bg-white/10" title={t('profile.delete_review')}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
      {/* Sidebar sidebar */}
      <div className="w-full md:w-64 space-y-6 shrink-0">
        <div className="glass p-6 rounded-3xl text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto group">
            <img 
              src={user.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'} 
              className="w-24 h-24 rounded-full border-4 border-white/5 object-cover" 
              alt="User"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-white/80 hover:text-white" title={t('profile.change_photo')}>
              <Camera size={24} />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} disabled={uploading} />
            </label>
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                <Loader2 className="animate-spin text-[var(--color-accent)]" size={24} />
              </div>
            )}
          </div>
          <div className="flex flex-col items-center">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  className="bg-black/40 border border-white/10 rounded-lg px-3 py-1 text-sm text-center w-full outline-none focus:border-[var(--color-accent)]"
                  autoFocus
                />
                <button onClick={handleSaveName} className="p-1.5 text-green-400 hover:bg-green-400/20 rounded-lg transition-colors"><Check size={16} /></button>
                <button onClick={() => { setIsEditingName(false); setNewName(user.displayName || ''); }} className="p-1.5 text-red-400 hover:bg-red-400/20 rounded-lg transition-colors"><X size={16} /></button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group/name cursor-pointer" onClick={() => setIsEditingName(true)}>
                <h2 className="font-bold text-xl group-hover/name:text-[var(--color-accent)] transition-colors">{user.displayName || t('profile.user_placeholder')}</h2>
                <Edit2 size={14} className="opacity-0 group-hover/name:opacity-100 transition-opacity text-[var(--color-accent)]" />
              </div>
            )}
            <p className="text-xs text-white/40 mt-1">{user.email}</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-bold text-sm uppercase mt-4"
          >
            <LogOut size={16} /> {t('profile.logout_btn')}
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSearchParams({ tab: tab.id })}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl transition-all font-bold uppercase text-sm ${isActive ? 'bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/20' : 'glass text-white/60 hover:text-white'}`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {(() => {
              const activeHeader = tabs.find(t => t.id === activeTab);
              const Icon = activeHeader?.icon;
              return (
                <h1 className="text-3xl font-display font-bold tracking-tight flex items-center gap-3 uppercase">
                  {Icon && <Icon className="text-[var(--color-accent)]" size={32} />}
                  {activeHeader?.label}
                </h1>
              );
            })()}
          </div>
          {activeTab === 'history' && !loadingData && data.length > 0 && (
            <button 
              onClick={handleClearHistory}
              className="px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 hover:border-white/20 transition-all font-bold text-sm flex items-center justify-center gap-2 text-white/60 hover:text-white"
            >
              <Trash2 size={16} />
              {t('profile.clear_history')}
            </button>
          )}
        </div>

        {loadingData ? (
          <div className="h-[40vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-[var(--color-accent)]" size={32} />
          </div>
        ) : data.length === 0 ? (
          <div className="h-[40vh] flex flex-col items-center justify-center text-white/40">
            <p className="text-lg uppercase font-bold tracking-widest">{t('profile.empty')}</p>
          </div>
        ) : (
          <div className={activeTab === 'reviews' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'}>
            {data.map(item => (
              activeTab === 'reviews' 
                ? <ReviewCard key={item.id} review={item} /> 
                : <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
