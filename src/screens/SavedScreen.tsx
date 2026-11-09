/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, Compass, MapPin, Sparkles, Utensils } from 'lucide-react';
import { Destination, Attraction, Favorite } from '../types';
import { DestinationCard } from '../components/DestinationCard';
import { AttractionCard } from '../components/AttractionCard';

interface SavedScreenProps {
  destinations: Destination[];
  attractions: Attraction[];
  favorites: Favorite[];
  onSelectDestination: (destination: Destination) => void;
  onSelectAttraction: (attraction: Attraction) => void;
  onToggleFavoriteDestination: (id: number) => void;
  onToggleFavoriteAttraction: (id: number) => void;
  onExploreMore: () => void;
}

export const SavedScreen: React.FC<SavedScreenProps> = ({
  destinations,
  attractions,
  favorites,
  onSelectDestination,
  onSelectAttraction,
  onToggleFavoriteDestination,
  onToggleFavoriteAttraction,
  onExploreMore
}) => {
  const [activeCategory, setActiveCategory] = useState<'destinations' | 'attractions' | 'experiences'>('destinations');

  // Destinos favoritos
  const favDestIds = favorites.filter(f => f.destinationId).map(f => f.destinationId);
  const savedDestinations = destinations.filter(d => favDestIds.includes(d.id));

  // Atrações favoritas
  const favAttrIds = favorites.filter(f => f.attractionId).map(f => f.attractionId);
  const savedAttractions = attractions.filter(a => favAttrIds.includes(a.id) && a.category !== 'gastronomy');
  
  // Experiências / Gastronomia favoritas
  const savedExperiences = attractions.filter(a => favAttrIds.includes(a.id) && (a.category === 'gastronomy' || a.category === 'adventure'));

  return (
    <div className="space-y-5 pb-24">
      {/* Header */}
      <div>
        <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
          Coleção Pessoal
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Lugares Salvos
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Seus destinos, atrações e experiências favoritas reunidos em um só lugar
        </p>
      </div>

      {/* Categorias de Favoritos com Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
        <button
          onClick={() => setActiveCategory('destinations')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeCategory === 'destinations'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Destinos ({savedDestinations.length})
        </button>

        <button
          onClick={() => setActiveCategory('attractions')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeCategory === 'attractions'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Atrações ({savedAttractions.length})
        </button>

        <button
          onClick={() => setActiveCategory('experiences')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeCategory === 'experiences'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Experiências ({savedExperiences.length})
        </button>
      </div>

      {/* Conteúdo de acordo com a aba selecionada */}
      {activeCategory === 'destinations' && (
        <>
          {savedDestinations.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center">
                <Heart className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Nenhum destino salvo ainda
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Ao explorar cidades e destinos turísticos, toque no ícone de coração para salvá-los aqui.
                </p>
              </div>
              <button
                onClick={onExploreMore}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
              >
                Explorar Destinos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {savedDestinations.map(dest => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  isFavorited={true}
                  onToggleFavorite={() => onToggleFavoriteDestination(dest.id)}
                  onClick={() => onSelectDestination(dest)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeCategory === 'attractions' && (
        <>
          {savedAttractions.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center">
                <Compass className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Nenhuma atração salva ainda
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Encontre pontos turísticos e parques incríveis para adicionar à sua lista de desejos.
                </p>
              </div>
              <button
                onClick={onExploreMore}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
              >
                Descobrir Atrações
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedAttractions.map(attr => (
                <AttractionCard
                  key={attr.id}
                  attraction={attr}
                  isFavorited={true}
                  onToggleFavorite={() => onToggleFavoriteAttraction(attr.id)}
                  onClick={() => onSelectAttraction(attr)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeCategory === 'experiences' && (
        <>
          {savedExperiences.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 mx-auto flex items-center justify-center">
                <Utensils className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Nenhuma experiência salva
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Salve experiências gastronômicas, fondues, acarajés e passeios de aventura para o seu roteiro.
                </p>
              </div>
              <button
                onClick={onExploreMore}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-xs active:scale-95 transition-all"
              >
                Explorar Experiências
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {savedExperiences.map(attr => (
                <AttractionCard
                  key={attr.id}
                  attraction={attr}
                  isFavorited={true}
                  onToggleFavorite={() => onToggleFavoriteAttraction(attr.id)}
                  onClick={() => onSelectAttraction(attr)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
