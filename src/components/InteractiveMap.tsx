/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Componente de Mapa Interativo do Navigo
 * Arquitetado para suportar renderização de coordenadas reais (lat/lng),
 * marcadores de atrações, cálculo de distância/tempo estimado e rotas,
 * pronto para integração futura com Google Maps Platform, Mapbox ou OpenStreetMap.
 */

import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, Info, Star, Clock, Car, ExternalLink } from 'lucide-react';
import { Destination, Attraction, ItineraryItem } from '../types';
import { CATEGORY_LABELS } from '../data/seedData';

interface InteractiveMapProps {
  destinations: Destination[];
  attractions: Attraction[];
  selectedDestinationId?: number;
  onSelectDestination?: (id: number) => void;
  activeItineraryItems?: ItineraryItem[];
  onOpenAttraction?: (attraction: Attraction) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  destinations,
  attractions,
  selectedDestinationId,
  onSelectDestination,
  activeItineraryItems,
  onOpenAttraction
}) => {
  const currentDestId = selectedDestinationId || destinations[0]?.id || 1;
  const currentDest = destinations.find(d => d.id === currentDestId) || destinations[0];
  const destAttractions = attractions.filter(a => a.destinationId === currentDestId);

  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(
    destAttractions[0] || null
  );
  const [mapStyle, setMapStyle] = useState<'streets' | 'satellite' | 'terrain'>('streets');
  const [showRoute, setShowRoute] = useState<boolean>(true);

  // Projeção simples de Latitude e Longitude para coordenadas SVG relativas
  // Baseadas no bounding box do destino selecionado
  const minLat = Math.min(...destAttractions.map(a => a.latitude), currentDest.latitude) - 0.05;
  const maxLat = Math.max(...destAttractions.map(a => a.latitude), currentDest.latitude) + 0.05;
  const minLng = Math.min(...destAttractions.map(a => a.longitude), currentDest.longitude) - 0.05;
  const maxLng = Math.max(...destAttractions.map(a => a.longitude), currentDest.longitude) + 0.05;

  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng || 0.1)) * 340 + 30;
    const y = ((maxLat - lat) / (maxLat - minLat || 0.1)) * 320 + 40;
    return { x, y };
  };

  // Calcular pontos ordenados para a rota
  const routePoints = destAttractions.map(a => project(a.latitude, a.longitude));
  const polylinePoints = routePoints.map(p => `${p.x},${p.y}`).join(' ');

  // Estimativas simuladas de distância total
  const estimatedTotalKm = (destAttractions.length * 4.2).toFixed(1);
  const estimatedTravelTimeMin = destAttractions.length * 15;

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 bg-slate-900 shadow-sm flex flex-col">
      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {/* Seletor de Destino */}
        <div className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-1 shadow-md border border-slate-200/80 dark:border-slate-800 flex items-center gap-1 overflow-x-auto max-w-[280px] sm:max-w-none">
          {destinations.slice(0, 4).map(d => (
            <button
              key={d.id}
              onClick={() => {
                onSelectDestination?.(d.id);
                const first = attractions.find(a => a.destinationId === d.id);
                if (first) setSelectedAttraction(first);
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                currentDestId === d.id 
                  ? 'bg-teal-600 text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {d.city}
            </button>
          ))}
        </div>

        {/* Botão de Toggle de Rota e Estilo */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl p-1 shadow-md border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setShowRoute(!showRoute)}
            className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
              showRoute ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300' : 'text-slate-500'
            }`}
            title="Alternar traçado de rota"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Rota</span>
          </button>
        </div>
      </div>

      {/* Canvas SVG do Mapa */}
      <div className="relative flex-1 w-full bg-[#182234] overflow-hidden select-none cursor-grab active:cursor-grabbing">
        <svg 
          viewBox="0 0 400 400" 
          className="w-full h-full object-cover"
        >
          {/* Malha de coordenadas e mapa conceitual */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="1" />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0D9488" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Rios ou contorno visual estilizado */}
          <path 
            d="M -20,200 Q 150,180 220,260 T 420,230" 
            fill="none" 
            stroke="#0e3d54" 
            strokeWidth="18" 
            opacity="0.5" 
          />
          <path 
            d="M 50,0 Q 120,140 180,420" 
            fill="none" 
            stroke="#1b384d" 
            strokeWidth="8" 
            opacity="0.3" 
          />

          {/* Linha da Rota conectando os pontos */}
          {showRoute && routePoints.length > 1 && (
            <>
              <polyline
                points={polylinePoints}
                fill="none"
                stroke="#0D9488"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
              <polyline
                points={polylinePoints}
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </>
          )}

          {/* Marcador de Centro do Destino */}
          {(() => {
            const p = project(currentDest.latitude, currentDest.longitude);
            return (
              <g transform={`translate(${p.x}, ${p.y})`}>
                <circle r="12" fill="#0D9488" fillOpacity="0.2" className="animate-ping" />
                <circle r="6" fill="#0D9488" />
                <circle r="2" fill="#ffffff" />
                <text 
                  y="-12" 
                  textAnchor="middle" 
                  fill="#94A3B8" 
                  fontSize="9" 
                  fontWeight="600"
                >
                  Centro de {currentDest.city}
                </text>
              </g>
            );
          })()}

          {/* Marcadores das Atrações */}
          {destAttractions.map((attr, idx) => {
            const pos = project(attr.latitude, attr.longitude);
            const isSelected = selectedAttraction?.id === attr.id;
            const cat = CATEGORY_LABELS[attr.category] || { icon: '📍', label: attr.category };

            return (
              <g 
                key={attr.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onClick={() => setSelectedAttraction(attr)}
                className="cursor-pointer group"
              >
                {isSelected && (
                  <circle r="18" fill="#F97316" fillOpacity="0.3" className="animate-ping" />
                )}
                <circle 
                  r={isSelected ? 14 : 11} 
                  fill={isSelected ? '#F97316' : '#1E293B'} 
                  stroke={isSelected ? '#FFFFFF' : '#0D9488'} 
                  strokeWidth="2.5" 
                  className="transition-all"
                />
                <text 
                  y="4" 
                  textAnchor="middle" 
                  fill="#FFFFFF" 
                  fontSize={isSelected ? '10' : '9'} 
                  fontWeight="bold"
                >
                  {idx + 1}
                </text>

                {/* Tooltip rápida */}
                <text 
                  y="-16" 
                  textAnchor="middle" 
                  fill={isSelected ? '#F8FAFC' : '#94A3B8'} 
                  fontSize="9" 
                  fontWeight="600"
                  className="pointer-events-none drop-shadow-sm"
                >
                  {attr.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Indicador de Rota Resumo Flutuante */}
        {showRoute && (
          <div className="absolute top-16 left-3 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-lg text-white text-[11px] flex items-center gap-2">
            <Car className="w-3.5 h-3.5 text-teal-400" />
            <span>Circuito: <strong className="text-white">{estimatedTotalKm} km</strong></span>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span>~{estimatedTravelTimeMin} min de deslocamento</span>
          </div>
        )}

        {/* Selo Arquitetural ADS: Suporte a Google Maps / Mapbox */}
        <div className="absolute bottom-24 right-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-2 py-1 rounded text-[10px] text-slate-400 flex items-center gap-1">
          <Info className="w-3 h-3 text-teal-400" />
          <span>API-Ready: Lat {currentDest.latitude.toFixed(2)}, Lng {currentDest.longitude.toFixed(2)}</span>
        </div>
      </div>

      {/* Drawer Inferior com Detalhes da Atração Selecionada */}
      {selectedAttraction ? (
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 p-3.5 flex items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <img 
              src={selectedAttraction.imageUrl} 
              alt={selectedAttraction.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-xl object-cover shrink-0" 
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
                <span>{CATEGORY_LABELS[selectedAttraction.category]?.icon} {CATEGORY_LABELS[selectedAttraction.category]?.label}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-0.5 text-amber-500 font-semibold tabular-nums">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {selectedAttraction.rating.toFixed(1)}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {selectedAttraction.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {selectedAttraction.address || `${currentDest.city}, ${currentDest.country}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenAttraction?.(selectedAttraction)}
              className="px-3 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:scale-95 rounded-xl shadow-sm transition-all"
            >
              Ver Detalhes
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 text-center text-xs text-slate-500">
          Selecione um marcador no mapa para ver informações da atração.
        </div>
      )}
    </div>
  );
};
