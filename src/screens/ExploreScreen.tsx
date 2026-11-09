/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, X, Clock, SlidersHorizontal, MapPin, Compass, Star } from 'lucide-react';
import { Destination, Attraction, CategoryType } from '../types';
import { DestinationCard } from '../components/DestinationCard';
import { AttractionCard } from '../components/AttractionCard';
import { CATEGORY_LABELS } from '../data/seedData';
import { api } from '../services/apiClient';

interface ExploreScreenProps {
  destinations: Destination[];
  attractions: Attraction[];
  initialQuery?: string;
  initialCategory?: CategoryType;
  onSelectDestination: (destination: Destination) => void;
  onSelectAttraction: (attraction: Attraction) => void;
  isDestinationFavorited: (id: number) => boolean;
  isAttractionFavorited: (id: number) => boolean;
  onToggleFavoriteDestination: (id: number) => void;
  onToggleFavoriteAttraction: (id: number) => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  destinations,
  attractions,
  initialQuery = '',
  initialCategory,
  onSelectDestination,
  onSelectAttraction,
  isDestinationFavorited,
  isAttractionFavorited,
  onToggleFavoriteDestination,
  onToggleFavoriteAttraction
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'all'>(
    initialCategory || 'all'
  );
  const [filterType, setFilterType] = useState<'all' | 'destinations' | 'attractions'>('all');
  const [searchHistory, setSearchHistory] = useState<string[]>(api.getSearchHistory());

  const categories: { key: CategoryType | 'all'; label: string; icon?: string }[] = [
    { key: 'all', label: 'Todos' },
    { key: 'nature', label: 'Natureza', icon: '🌿' },
    { key: 'beach', label: 'Praias', icon: '🏖️' },
    { key: 'culture', label: 'Cultura', icon: '🏛️' },
    { key: 'gastronomy', label: 'Gastronomia', icon: '🍴' },
    { key: 'adventure', label: 'Aventura', icon: '🧗' },
    { key: 'nightlife', label: 'Vida Noturna', icon: '🌙' }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      api.addSearchHistory(query);
      setSearchHistory(api.getSearchHistory());
    }
  };

  const handleHistoryClick = (term: string) => {
    setQuery(term);
  };

  // Filtragem combinada
  const filteredDestinations = useMemo(() => {
    if (filterType === 'attractions') return [];
    return destinations.filter((dest) => {
      const matchQuery =
        !query.trim() ||
        dest.name.toLowerCase().includes(query.toLowerCase()) ||
        dest.city.toLowerCase().includes(query.toLowerCase()) ||
        dest.country.toLowerCase().includes(query.toLowerCase()) ||
        dest.description.toLowerCase().includes(query.toLowerCase());

      return matchQuery;
    });
  }, [destinations, query, filterType]);

  const filteredAttractions = useMemo(() => {
    if (filterType === 'destinations') return [];
    return attractions.filter((attr) => {
      const matchCategory = selectedCategory === 'all' || attr.category === selectedCategory;
      const matchQuery =
        !query.trim() ||
        attr.name.toLowerCase().includes(query.toLowerCase()) ||
        attr.description.toLowerCase().includes(query.toLowerCase()) ||
        attr.category.toLowerCase().includes(query.toLowerCase());

      return matchCategory && matchQuery;
    });
  }, [attractions, query, selectedCategory, filterType]);

  const totalResults = filteredDestinations.length + filteredAttractions.length;

  return (
    <div className="space-y-5 pb-24">
      {/* 1. Header & Barra de Busca */}
      <section className="space-y-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Explorar & Pesquisar
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Descubra cidades, pontos turísticos, restaurantes e experiências
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquise por nome, local, comida, museu..."
            className="w-full h-12 pl-11 pr-24 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs transition-all"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-14 top-3 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-2 top-2 px-3 py-1.5 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-xl shadow-xs transition-all"
          >
            Buscar
          </button>
        </form>

        {/* Histórico de pesquisas recentes */}
        {searchHistory.length > 0 && !query && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-slate-500">
            <span className="flex items-center gap-1 shrink-0 font-medium text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              Recentes:
            </span>
            {searchHistory.map((item) => (
              <button
                key={item}
                onClick={() => handleHistoryClick(item)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 2. Filtros de Categoria (Pill tabs com handlers) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Categorias de Interesse</span>
          {selectedCategory !== 'all' && (
            <button 
              onClick={() => setSelectedCategory('all')}
              className="text-teal-600 dark:text-teal-400 hover:underline text-[11px]"
            >
              Limpar filtro
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.key
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-teal-500/50'
              }`}
            >
              {cat.icon && <span className="mr-1">{cat.icon}</span>}
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Seletor de Tipo (Todos / Destinos / Atrações) */}
      <section className="flex items-center justify-between pt-1 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'all' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Todos ({totalResults})
          </button>
          <button
            onClick={() => setFilterType('destinations')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'destinations' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Destinos ({filteredDestinations.length})
          </button>
          <button
            onClick={() => setFilterType('attractions')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              filterType === 'attractions' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Atrações ({filteredAttractions.length})
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          {totalResults} resultados encontrados
        </span>
      </section>

      {/* 4. Lista de Resultados */}
      {totalResults === 0 ? (
        <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-2">
          <Compass className="w-10 h-10 text-slate-400 mx-auto stroke-[1.5]" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Nenhum resultado encontrado
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Tente buscar com outros termos como "Cataratas", "Praia", "Salvador" ou limpe os filtros de categoria.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Seção de Destinos */}
          {filteredDestinations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                Cidades e Destinos ({filteredDestinations.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {filteredDestinations.map((dest) => (
                  <DestinationCard
                    key={dest.id}
                    destination={dest}
                    isFavorited={isDestinationFavorited(dest.id)}
                    onToggleFavorite={() => onToggleFavoriteDestination(dest.id)}
                    onClick={() => onSelectDestination(dest)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Seção de Atrações e Experiências */}
          {filteredAttractions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-xs">
                Pontos Turísticos & Experiências ({filteredAttractions.length})
              </h3>
              <div className="space-y-2.5">
                {filteredAttractions.map((attr) => (
                  <AttractionCard
                    key={attr.id}
                    attraction={attr}
                    isFavorited={isAttractionFavorited(attr.id)}
                    onToggleFavorite={() => onToggleFavoriteAttraction(attr.id)}
                    onClick={() => onSelectAttraction(attr)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
