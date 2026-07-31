import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Play, Layers } from 'lucide-react';
import { motion } from 'motion/react';

export let AnimeCard = ({ anime }) => {
  let [imgLoaded, setImgLoaded] = useState(false);

  let posterUrl = anime.poster?.optimized?.src
    ? `https://anilibria.top${anime.poster.optimized.src}`
    : `https://anilibria.top${anime.poster?.src}`;

  let favorites = anime.added_in_users_favorites ?? null;
  let favLabel = favorites != null
    ? favorites >= 1000
      ? (favorites / 1000).toFixed(1) + 'K'
      : String(favorites)
    : null;

  let episodesCount = anime.episodes?.last ?? null;

  // Status color
  let statusColor = 'bg-white/10 text-white/60';
  if (anime.status?.code === 'ongoing') statusColor = 'bg-green-500/20 text-green-400';
  else if (anime.status?.code === 'released') statusColor = 'bg-blue-500/20 text-blue-400';

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer card-shine"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
    >
      <Link to={`/anime/${anime.id}`}>
        {/* Skeleton loader */}
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}

        <img
          src={posterUrl}
          alt={anime.name.main}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy="no-referrer"
        />

        {/* Always-visible gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Favorites badge */}
        {favLabel && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/80 backdrop-blur-md rounded-full px-2.5 py-1 z-10 border border-pink-500/20">
            <Heart size={10} fill="#f472b6" className="text-pink-400" />
            <span className="text-[11px] font-bold text-pink-400 leading-none">{favLabel}</span>
          </div>
        )}

        {/* Episodes badge */}
        {episodesCount && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/80 backdrop-blur-md rounded-full px-2.5 py-1 z-10 border border-white/10">
            <Layers size={9} className="text-white/60" />
            <span className="text-[11px] font-medium text-white/70 leading-none">{episodesCount} эп.</span>
          </div>
        )}

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="w-14 h-14 rounded-full bg-[#ff4d00] flex items-center justify-center shadow-lg shadow-[#ff4d00]/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play size={20} fill="white" className="text-white ml-0.5" />
          </div>
        </div>

        {/* Title - always visible */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <h3 className="font-display font-bold text-sm leading-tight line-clamp-2 drop-shadow-lg">{anime.name.main}</h3>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            {anime.status?.label && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide ${statusColor}`}>
                {anime.status.label}
              </span>
            )}
            {anime.year && <span className="text-[10px] text-white/40">{anime.year}</span>}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
