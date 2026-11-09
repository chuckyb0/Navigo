/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Clock, Heart, MapPin } from 'lucide-react';
import { Attraction } from '../types';
import { CATEGORY_LABELS } from '../data/seedData';

interface AttractionCardProps {
  attraction: Attraction;
  isFavorited: boolean;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onClick?: () => void;
  layout?: 'horizontal' | 'vertical';
}

export const AttractionCard: React.FC<AttractionCardProps> = ({
  attraction,
  isFavorited,
  onToggleFavorite,
  onClick,
  layout = 'horizontal'
}) => {
  const cat = CATEGORY_LABELS[attraction.category] || { label: attraction.category, icon: '📍' };

  if (layout === 'vertical') {
    return (
      <div 
        onClick={onClick}
        className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden cursor-pointer hover:border-teal-500/50 transition-all flex flex-col active:scale-[0.99]"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img 
            src={attraction.imageUrl} 
            alt={attraction.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(e);
            }}
            aria-label={isFavorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
            className="absolute top-2.5 right-2.5 min-w-[36px] min-h-[36px] rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-all"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
          </button>
        </div>

        <div className="p-3.5 flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>{cat.icon} {cat.label}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-0.5 text-amber-500 font-semibold tabular-nums">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {attraction.rating.toFixed(1)}
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-teal-600 transition-colors">
              {attraction.name}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
              {attraction.description}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{Math.round(attraction.estimatedDurationMin / 60)}h</span>
            </span>
            <span className="font-semibold text-slate-900 dark:text-slate-200 tabular-nums">
              {attraction.estimatedCost > 0 ? `R$ ${attraction.estimatedCost}` : 'Gratuito'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="group bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 p-3 flex items-center gap-3.5 cursor-pointer hover:border-teal-500/50 transition-all active:scale-[0.99]"
    >
      <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
        <img 
          src={attraction.imageUrl} 
          alt={attraction.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-semibold text-white flex items-center gap-0.5">
          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
          <span className="tabular-nums">{attraction.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
          <span>{cat.icon} {cat.label}</span>
          <span aria-hidden="true">·</span>
          <span>{Math.round(attraction.estimatedDurationMin / 60)}h visita</span>
        </div>

        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {attraction.name}
        </h4>

        <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
          {attraction.description}
        </p>

        <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-slate-200 mt-1.5">
          <span className="text-teal-600 dark:text-teal-400 tabular-nums">
            {attraction.estimatedCost > 0 ? `R$ ${attraction.estimatedCost}` : 'Entrada Franca'}
          </span>
          <span className="text-[11px] font-normal text-slate-400">{attraction.priceLevel}</span>
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(e);
        }}
        aria-label={isFavorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
        className="min-w-[40px] min-h-[40px] rounded-full flex items-center justify-center text-slate-400 hover:text-rose-500 active:scale-90 transition-all shrink-0"
      >
        <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-300 dark:text-slate-600'}`} />
      </button>
    </div>
  );
};
