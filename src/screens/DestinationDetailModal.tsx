/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Heart, Star, MapPin, Calendar, Plus, Compass, Info, DollarSign, Utensils, Sparkles } from 'lucide-react';
import { Destination, Attraction } from '../types';
import { AttractionCard } from '../components/AttractionCard';

interface DestinationDetailModalProps {
  destination: Destination | null;
  attractions: Attraction[];
  isOpen: boolean;
  onClose: () => void;
  onPlanTrip: (destinationId: number) => void;
  isFavorited: boolean;
  onToggleFavorite: () => void;
  isAttractionFavorited: (id: number) => boolean;
  onToggleFavoriteAttraction: (id: number) => void;
  onSelectAttraction: (attraction: Attraction) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  attractions,
  isOpen,
  onClose,
  onPlanTrip,
  isFavorited,
  onToggleFavorite,
  isAttractionFavorited,
  onToggleFavoriteAttraction,
  onSelectAttraction
}) => {
  const [activeTab, setActiveTab] = useState<'attractions' | 'gastronomy' | 'info'>('attractions');

  if (!isOpen || !destination) return null;

  const destAttractions = attractions.filter(a => a.destinationId === destination.id);
  const mainAttractions = destAttractions.filter(a => a.category !== 'gastronomy');
  const gastronomySpots = destAttractions.filter(a => a.category === 'gastronomy');

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-2xl max-h-[92vh] sm:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800">
        {/* Hero Image Container com Scrim e Botões Flutuantes */}
        <div className="relative h-64 sm:h-72 w-full shrink-0 overflow-hidden bg-slate-900">
          <img 
            src={destination.imageUrl} 
            alt={destination.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-black/40" />

          {/* Botões de Ação no Topo */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <button
              onClick={onClose}
              aria-label="Voltar"
              className="min-w-[40px] min-h-[40px] rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={onToggleFavorite}
              aria-label={isFavorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
              className="min-w-[40px] min-h-[40px] rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/70 active:scale-95 transition-all"
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
            </button>
          </div>

          {/* Título e Metadados sobre a Imagem */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <div className="flex items-center gap-2 text-xs font-medium text-teal-300 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{destination.city}, {destination.state || destination.country}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-amber-300 font-semibold tabular-nums">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                {destination.rating.toFixed(1)}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {destination.name}
            </h2>
          </div>
        </div>

        {/* Abas de Navegação Interna */}
        <div className="px-5 pt-3 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('attractions')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'attractions'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Principais Atrações ({mainAttractions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gastronomy')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'gastronomy'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Gastronomia ({gastronomySpots.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('info')}
            className={`pb-2.5 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Informações Úteis</span>
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-sm">
          {/* Descrição Principal */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Sobre o Destino
            </h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs sm:text-sm">
              {destination.description}
            </p>
          </div>

          {/* Destaques Rápido */}
          {destination.highlights && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                O que você não pode perder
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {destination.highlights.map((h, i) => (
                  <span 
                    key={i} 
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                    {h}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Lista de Atrações da Aba Ativa */}
          {activeTab === 'attractions' && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Pontos Turísticos & Passeios
              </h3>
              {mainAttractions.length === 0 ? (
                <p className="text-xs text-slate-400">Nenhuma atração cadastrada ainda.</p>
              ) : (
                mainAttractions.map((attr) => (
                  <AttractionCard
                    key={attr.id}
                    attraction={attr}
                    isFavorited={isAttractionFavorited(attr.id)}
                    onToggleFavorite={() => onToggleFavoriteAttraction(attr.id)}
                    onClick={() => onSelectAttraction(attr)}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'gastronomy' && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Culinária Regional & Restaurantes
              </h3>
              {gastronomySpots.length === 0 ? (
                <p className="text-xs text-slate-400">Restaurantes típicos da região serão sugeridos no seu roteiro.</p>
              ) : (
                gastronomySpots.map((attr) => (
                  <AttractionCard
                    key={attr.id}
                    attraction={attr}
                    isFavorited={isAttractionFavorited(attr.id)}
                    onToggleFavorite={() => onToggleFavoriteAttraction(attr.id)}
                    onClick={() => onSelectAttraction(attr)}
                  />
                ))
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Melhor Época para Visitar
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {destination.bestTimeToVisit}
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Custo Médio Diário
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Aproximadamente <strong className="text-slate-900 dark:text-white">R$ {destination.averageDailyCost}</strong> por pessoa/dia incluindo passeios e alimentação.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 sm:col-span-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  Coordenadas Geográficas
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                  Latitude: {destination.latitude.toFixed(4)}, Longitude: {destination.longitude.toFixed(4)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Bottom CTA Bar */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-slate-400">Estimativa</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
              R$ {destination.averageDailyCost} <span className="text-[11px] font-normal text-slate-400">/dia</span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onPlanTrip(destination.id);
            }}
            className="flex-1 h-12 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Planejar Viagem para cá</span>
          </button>
        </div>
      </div>
    </div>
  );
};
