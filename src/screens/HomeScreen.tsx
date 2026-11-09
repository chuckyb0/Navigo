/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Compass, MapPin, Sparkles, Plus, ArrowRight, Star } from 'lucide-react';
import { Destination, Attraction, User, CategoryType } from '../types';
import { DestinationCard } from '../components/DestinationCard';
import { AttractionCard } from '../components/AttractionCard';
import { CATEGORY_LABELS } from '../data/seedData';

interface HomeScreenProps {
  user: User | null;
  destinations: Destination[];
  attractions: Attraction[];
  onSelectDestination: (destination: Destination) => void;
  onSelectAttraction: (attraction: Attraction) => void;
  onOpenPlanTrip: (destinationId?: number) => void;
  onOpenExplore: (searchQuery?: string, category?: CategoryType) => void;
  isDestinationFavorited: (id: number) => boolean;
  isAttractionFavorited: (id: number) => boolean;
  onToggleFavoriteDestination: (id: number) => void;
  onToggleFavoriteAttraction: (id: number) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  destinations,
  attractions,
  onSelectDestination,
  onSelectAttraction,
  onOpenPlanTrip,
  onOpenExplore,
  isDestinationFavorited,
  isAttractionFavorited,
  onToggleFavoriteDestination,
  onToggleFavoriteAttraction
}) => {
  const [searchInput, setSearchInput] = useState('');

  const featured = destinations[0];
  const popularDestinations = destinations.slice(1, 5);
  const featuredAttractions = attractions.slice(0, 4);

  const categories: { key: CategoryType; label: string; icon: string }[] = [
    { key: 'nature', label: 'Natureza', icon: '🌿' },
    { key: 'beach', label: 'Praias', icon: '🏖️' },
    { key: 'culture', label: 'Cultura', icon: '🏛️' },
    { key: 'gastronomy', label: 'Gastronomia', icon: '🍴' },
    { key: 'adventure', label: 'Aventura', icon: '🧗' },
    { key: 'nightlife', label: 'Vida Noturna', icon: '🌙' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      onOpenExplore(searchInput.trim());
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* 1. Header de Saudação e Campo de Busca */}
      <section className="space-y-3">
        <div>
          <div className="text-xs font-semibold text-teal-600 dark:text-teal-400 tracking-wide uppercase">
            Plataforma de Turismo
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Olá, {user?.name?.split(' ')[0] || 'Viajante'}! 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Para onde vamos na sua próxima memória?
          </p>
        </div>

        {/* Input de Busca estilo Mobile-First */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar cidade, estado, atração ou restaurante..."
            className="w-full h-12 pl-11 pr-24 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs transition-all"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
          <button
            type="submit"
            className="absolute right-2 top-2 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-xl shadow-xs transition-all"
          >
            Buscar
          </button>
        </form>
      </section>

      {/* 2. Categorias de Interesses (Interativo) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Categorias de Experiência
          </h2>
          <button 
            onClick={() => onOpenExplore()}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Ver todas
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onOpenExplore(undefined, cat.key)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-teal-500/60 hover:text-teal-600 dark:hover:text-teal-400 active:scale-95 shadow-xs whitespace-nowrap transition-all"
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Destino em Destaque (Featured Hero) */}
      {featured && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Destino em Destaque
            </h2>
            <span className="text-xs text-slate-400 font-medium">Top Avaliado</span>
          </div>

          <DestinationCard
            destination={featured}
            isFavorited={isDestinationFavorited(featured.id)}
            onToggleFavorite={() => onToggleFavoriteDestination(featured.id)}
            onClick={() => onSelectDestination(featured)}
            variant="featured"
          />
        </section>
      )}

      {/* 4. Banner de Chamada para Criar Viagem */}
      <section className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-sm">
          <div className="text-[11px] font-bold uppercase tracking-wider text-teal-300 mb-1">
            Planejador Inteligente
          </div>
          <h3 className="text-lg font-bold tracking-tight leading-snug mb-1">
            Crie seu roteiro personalizado em poucos segundos
          </h3>
          <p className="text-xs text-teal-100/90 leading-relaxed mb-3.5">
            Defina datas, viajantes, orçamento e preferências. O Navigo organiza seus dias automaticamente.
          </p>
          <button
            onClick={() => onOpenPlanTrip()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-teal-50 active:scale-95 shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-teal-600 stroke-[2.5]" />
            <span>Começar Planejamento</span>
          </button>
        </div>
        <div className="absolute -right-6 -bottom-8 w-36 h-36 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />
      </section>

      {/* 5. Destinos Populares */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Destinos Populares
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Lugares que estão conquistando viajantes neste momento
            </p>
          </div>
          <button 
            onClick={() => onOpenExplore()}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Explorar
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {popularDestinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              isFavorited={isDestinationFavorited(dest.id)}
              onToggleFavorite={() => onToggleFavoriteDestination(dest.id)}
              onClick={() => onSelectDestination(dest)}
            />
          ))}
        </div>
      </section>

      {/* 6. Atrações e Experiências Recomendadas */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Experiências Recomendadas
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pontos turísticos e passeios imperdíveis catalogados
            </p>
          </div>
        </div>

        <div className="space-y-2.5">
          {featuredAttractions.map((attr) => (
            <AttractionCard
              key={attr.id}
              attraction={attr}
              isFavorited={isAttractionFavorited(attr.id)}
              onToggleFavorite={() => onToggleFavoriteAttraction(attr.id)}
              onClick={() => onSelectAttraction(attr)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
