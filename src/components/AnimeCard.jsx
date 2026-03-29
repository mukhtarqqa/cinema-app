import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export const AnimeCard = ({ anime }) => {
  const posterUrl = anime.poster?.optimized?.src 
    ? `https://anilibria.top${anime.poster.optimized.src}`
    : `https://anilibria.top${anime.poster?.src}`;

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative aspect-[2/3] rounded-2xl overflow-hidden glass cursor-pointer"
    >
      <Link to={`/anime/${anime.id}`}>
        <img 
          src={posterUrl} 
          alt={anime.name.main} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <h3 className="font-display font-bold text-lg leading-tight mb-1">{anime.name.main}</h3>
          <div className="flex items-center gap-2 text-sm text-white/80">
            {anime.status?.label && (
              <span className="bg-[var(--color-accent)]/20 text-[var(--color-accent)] px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                {anime.status.label}
              </span>
            )}
            <span>•</span>
            <span>{anime.year}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
