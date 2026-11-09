/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Heart, MapPin, Calendar } from 'lucide-react';
import { Destination } from '../types';

interface DestinationCardProps {
  destination: Destination;
  isFavorited: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick: () => void;
  variant?: 'featured' | 'standard' | 'compact';
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  isFavorited,
  onToggleFavorite,
  onClick,
  variant = 'standard'
}) => {
  if (variant === 'featured') {
    return (
      <div 
        onClick={onClick}
        className="group relative w-full h-80 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-[0.99]"
      >
        <img 
          src={destination.imageUrl} 
          alt={destination.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Scrim com contraste medido */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        {/* Botão de Favorito no topo */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e);
          }}
          aria-label={isFavorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          className="absolute top-3.5 right-3.5 min-w-[44px] min-h-[44px] rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 active:scale-90 transition-all"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-white'}`} 
          />
        </button>

        {/* Conteúdo inferior */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <div className="flex items-center gap-2 text-xs font-medium text-teal-300 mb-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{destination.city}, {destination.state || destination.country}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-amber-300">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span className="tabular-nums font-semibold">{destination.rating.toFixed(1)}</span>
            </span>
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-white mb-2 leading-tight">
            {destination.name}
          </h3>

          <p className="text-xs text-slate-200 line-clamp-2 mb-3 leading-relaxed">
            {destination.description}
          </p>

          <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10">
            <span>{destination.attractionCount} atrações catalogadas</span>
            <span className="tabular-nums font-semibold text-white">
              Méd. R$ {destination.averageDailyCost}/dia
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden cursor-pointer hover:border-teal-500/50 transition-all active:scale-[0.99] flex flex-col"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src={destination.imageUrl} 
          alt={destination.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e);
          }}
          aria-label={isFavorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
          className="absolute top-3 right-3 min-w-[40px] min-h-[40px] rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 active:scale-90 transition-all"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-white'}`} 
          />
        </button>

        <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[11px] font-semibold text-white flex items-center gap-1">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span className="tabular-nums">{destination.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-0.5 truncate">
            {destination.city}, {destination.state || destination.country}
          </div>
          <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            {destination.name}
          </h4>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
          <span>{destination.attractionCount} locais</span>
          <span className="font-semibold text-slate-900 dark:text-slate-200 tabular-nums">
            R$ {destination.averageDailyCost}<span className="text-[10px] font-normal text-slate-400">/dia</span>
          </span>
        </div>
      </div>
    </div>
  );
};
