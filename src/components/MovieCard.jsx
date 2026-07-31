import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Play, Eye } from 'lucide-react';
import { motion } from 'motion/react';

export let MovieCard = ({ movie }) => {
  let [imgLoaded, setImgLoaded] = useState(false);
  let posterUrl = movie.poster_path 
    ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
    : 'https://picsum.photos/seed/movie/500/750';

  let rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;
  let year = movie.release_date?.split('-')[0];

  // Color-code rating
  let ratingColor = 'text-yellow-400';
  if (rating >= 8) ratingColor = 'text-green-400';
  else if (rating >= 6) ratingColor = 'text-yellow-400';
  else if (rating) ratingColor = 'text-red-400';

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group relative aspect-[2/3] rounded-2xl overflow-hidden cursor-pointer card-shine"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.4)' }}
    >
      <Link to={`/movie/${movie.id}`}>
        {/* Skeleton while loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 skeleton" />
        )}

        <img 
          src={posterUrl} 
          alt={movie.title} 
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          referrerPolicy="no-referrer"
        />

        {/* Always-visible bottom gradient with title */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Rating badge */}
        {rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/80 backdrop-blur-md rounded-full px-2.5 py-1 z-10 border border-white/10">
            <Star size={10} fill="currentColor" className={ratingColor} />
            <span className={`text-[11px] font-bold leading-none ${ratingColor}`}>{rating}</span>
          </div>
        )}

        {/* Play button on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <div className="w-14 h-14 rounded-full bg-[#ff4d00] flex items-center justify-center shadow-lg shadow-[#ff4d00]/50 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play size={20} fill="white" className="text-white ml-0.5" />
          </div>
        </div>

        {/* Title - always visible at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
          <h3 className="font-display font-bold text-sm leading-tight line-clamp-2 drop-shadow-lg">{movie.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            {year && <span className="text-[10px] text-white/50 font-medium">{year}</span>}
            {rating && (
              <div className="flex items-center gap-1">
                <Eye size={9} className="text-white/40" />
                <span className="text-[10px] text-white/40">{movie.vote_count ? (movie.vote_count > 1000 ? (movie.vote_count/1000).toFixed(0)+'K' : movie.vote_count) : ''}</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
