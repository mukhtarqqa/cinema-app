import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { tmdbService } from '../services/tmdb.js';
import { anilibriaService } from '../services/anilibria.js';
import { useAuth } from '../hooks/useAuth.jsx';
import { db, handleFirestoreError, OperationType } from '../firebase.js';
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Star, Heart, Play, Loader2, Calendar, Clock, Tag, AlertCircle, Plus } from 'lucide-react';
import Hls from 'hls.js';
import { motion } from 'motion/react';
import { ReviewSection } from '../components/ReviewSection.jsx';
import { useTranslation } from 'react-i18next';
import { addToHistory, addToWatchLater } from '../services/contentService.js';

export const Details = ({ type }) => {
  let { id } = useParams();
  let { user, login } = useAuth();
  let [loading, setLoading] = useState(true);
  let [data, setData] = useState(null);
  let [isFavorite, setIsFavorite] = useState(false);
  let [favoriteId, setFavoriteId] = useState(null);
  let [isWatchLater, setIsWatchLater] = useState(false);
  let [watchLaterId, setWatchLaterId] = useState(null);
  let [selectedEpisode, setSelectedEpisode] = useState(0);
  let [isDemo, setIsDemo] = useState(false);
  let videoRef = useRef(null);
  let { t, i18n } = useTranslation();

  let getTMDBLanguage = (lang) => {
    if (lang === 'en') return 'en-US';
    return 'ru-RU'; // Default for kk and ru
  };

  useEffect(() => {
    let fetchData = async () => {
      setLoading(true);
      try {
        if (type === 'movie') {
          let tmdbLang = getTMDBLanguage(i18n.language);
          let movie = await tmdbService.getDetails(id, tmdbLang);
          setData(movie);
          setIsDemo(!!movie.is_demo);
          addToHistory(movie, 'movie');
        } else {
          let anime = await anilibriaService.getDetails(id);
          setData(anime);
          addToHistory(anime, 'anime');
        }
      } catch (error) {
        console.error('Failed to fetch details', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, type, i18n.language]);

  useEffect(() => {
    if (!user || !id) return;
    let q = query(collection(db, 'favorites'), where('uid', '==', user.uid), where('contentId', '==', id), where('contentType', '==', type));
    let unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setIsFavorite(true);
        setFavoriteId(snapshot.docs[0].id);
      } else {
        setIsFavorite(false);
        setFavoriteId(null);
      }
    });
    return () => unsubscribe();
  }, [user, id, type]);

  useEffect(() => {
    if (!user || !id) return;
    let q = query(collection(db, 'watchLater'), where('uid', '==', user.uid), where('itemId', '==', id), where('contentType', '==', type));
    let unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setIsWatchLater(true);
        setWatchLaterId(snapshot.docs[0].id);
      } else {
        setIsWatchLater(false);
        setWatchLaterId(null);
      }
    });
    return () => unsubscribe();
  }, [user, id, type]);

  let toggleFavorite = async () => {
    if (!user) return login();
    try {
      if (isFavorite && favoriteId) {
        await deleteDoc(doc(db, 'favorites', favoriteId));
      } else {
        const favId = `${user.uid}_${id}`;
        await setDoc(doc(db, 'favorites', favId), {
          uid: user.uid,
          contentId: id,
          contentType: type,
          title: type === 'movie' ? data.title : data.name.main,
          posterPath: type === 'movie' ? data.poster_path : data.poster.src,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, isFavorite ? OperationType.DELETE : OperationType.CREATE, 'favorites');
    }
  };

  let toggleWatchLater = async () => {
    if (!user) return login();
    try {
      if (isWatchLater && watchLaterId) {
        await deleteDoc(doc(db, 'watchLater', watchLaterId));
      } else {
        await addToWatchLater(data, type);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (type === 'anime' && data?.episodes?.[selectedEpisode] && videoRef.current) {
      let ep = data.episodes[selectedEpisode];
      let hlsUrl = ep.hls_1080 || ep.hls_720 || ep.hls_480;
      if (hlsUrl) {
        let video = videoRef.current;
        if (Hls.isSupported()) {
          let hls = new Hls();
          hls.loadSource(hlsUrl);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = hlsUrl;
        }
      }
    }
  }, [data, selectedEpisode, type]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-[var(--color-accent)]" size={64} />
    </div>
  );

  if (!data) return <div className="pt-32 text-center">{t('details.not_found')}</div>;

  let backdropUrl = type === 'movie' 
    ? (data.backdrop_path.startsWith('http') ? data.backdrop_path : `https://image.tmdb.org/t/p/original${data.backdrop_path}`)
    : `https://anilibria.top${data.poster?.src}`;

  return (
    <div className="relative min-h-screen">
      {isDemo && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-amber-500/10 border border-amber-500/20 rounded-full px-6 py-2 flex items-center gap-3 text-amber-400 backdrop-blur-md">
          <AlertCircle size={16} />
          <p className="text-xs font-bold uppercase tracking-widest">{t('details.demo_mode')}</p>
        </div>
      )}
      
      <div className="absolute inset-0 h-[70vh] z-0">
        <img src={backdropUrl} alt="Backdrop" className="w-full h-full object-cover opacity-20" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0502] via-[#0a0502]/60 to-transparent" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-12">
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-48 sm:w-64 lg:w-full mx-auto aspect-[2/3] rounded-2xl overflow-hidden glass shadow-2xl"
          >
            <img 
              src={type === 'movie' 
                ? (data.poster_path.startsWith('http') ? data.poster_path : `https://image.tmdb.org/t/p/w500${data.poster_path}`) 
                : `https://anilibria.top${data.poster?.src}`} 
              alt={type === 'movie' ? data.title : data.name?.main} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          
          <button 
            onClick={toggleFavorite}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${isFavorite ? 'bg-white text-black' : 'glass text-white hover:bg-white/10'}`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? t('details.in_favorites') : t('details.add_to_favorites')}
          </button>

          <button 
            onClick={toggleWatchLater}
            className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all mt-4 ${isWatchLater ? 'bg-white text-black' : 'glass text-white hover:bg-white/10'}`}
          >
            <Clock size={20} />
            {isWatchLater ? t('details.in_watch_later') : t('details.add_to_watch_later')}
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-5xl sm:text-6xl font-display font-bold tracking-tighter leading-none"
            >
              {type === 'movie' ? data.title : data.name?.main}
            </motion.h1>
            
            <div className="flex flex-wrap items-center gap-4 text-white/60">
              <div className="flex items-center gap-1.5 text-yellow-400 font-bold">
                <Star size={18} fill="currentColor" />
                <span>{type === 'movie' ? data.vote_average?.toFixed(1) : 'N/A'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={18} />
                <span>{type === 'movie' ? data.release_date?.split('-')[0] : data.year}</span>
              </div>
              {type === 'movie' && data.runtime && (
                <div className="flex items-center gap-1.5">
                  <Clock size={18} />
                  <span>{data.runtime} {t('details.min')}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Tag size={18} />
                <span>{data.genres?.map((g) => g.name).join(', ')}</span>
              </div>
            </div>
          </div>

          <p className="text-lg text-white/80 leading-relaxed max-w-3xl">
            {type === 'movie' ? data.overview : data.description?.replace(/\[.*?\]/g, '')}
          </p>

          <div className="space-y-6 pt-8 border-t border-white/5">
            <h2 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2 uppercase">
              <Play size={24} className="text-[var(--color-accent)]" />
              {t('details.watch_now')}
            </h2>

            {type === 'anime' ? (
              <div className="space-y-4">
                <div className="aspect-video w-full rounded-3xl overflow-hidden glass bg-black">
                  <video ref={videoRef} controls className="w-full h-full" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.episodes?.map((ep, idx) => (
                    <button 
                      key={ep.id}
                      onClick={() => setSelectedEpisode(idx)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedEpisode === idx ? 'bg-[var(--color-accent)] text-white' : 'glass hover:bg-white/10'}`}
                    >
                      {ep.ordinal} {t('details.episode')}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="aspect-video w-full rounded-3xl overflow-hidden glass bg-black">
                {data.videos?.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ? (
                  <iframe 
                    src={`https://www.youtube.com/embed/${data.videos.find((v) => v.type === 'Trailer').key}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40">
                    {t('details.no_trailer')}
                  </div>
                )}
              </div>
            )}
          </div>

          <ReviewSection contentId={id} contentType={type} />
        </div>
      </div>
    </div>
  );
};
