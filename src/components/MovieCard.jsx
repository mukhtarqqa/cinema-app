import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { motion } from 'motion/react';

export let MovieCard = ({ movie }) => {
  let posterUrl = movie.poster_path 
    ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
    : 'https://picsum.photos/seed/movie/500/750';

  let rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative aspect-[2/3] rounded-2xl overflow-hidden glass cursor-pointer"
    >
      <Link to={`/movie/${movie.id}`}>
        <img 
          src={posterUrl} 
          alt={movie.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />

        {rating && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/75 backdrop-blur-sm rounded-full px-2 py-1 z-10">
            <Star size={10} fill="#facc15" className="text-yellow-400" />
            <span className="text-[11px] font-bold text-yellow-400 leading-none">{rating}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="font-display font-bold text-lg leading-tight mb-1">{movie.title}</h3>
          <div className="flex items-center gap-2 text-sm text-white/80">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={14} fill="currentColor" />
              <span>{rating || 'N/A'}</span>
            </div>
            <span>•</span>
            <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
