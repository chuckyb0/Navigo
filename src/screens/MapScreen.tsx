/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Layers, Info } from 'lucide-react';
import { Destination, Attraction, Trip } from '../types';
import { InteractiveMap } from '../components/InteractiveMap';

interface MapScreenProps {
  destinations: Destination[];
  attractions: Attraction[];
  activeTrip: Trip | null;
  onOpenAttraction: (attraction: Attraction) => void;
  onPlanTrip: (destinationId: number) => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  destinations,
  attractions,
  activeTrip,
  onOpenAttraction,
  onPlanTrip
}) => {
  const [selectedDestId, setSelectedDestId] = useState<number>(
    activeTrip?.destinationId || destinations[0]?.id || 1
  );

  const currentDest = destinations.find(d => d.id === selectedDestId) || destinations[0];
  const destAttractions = attractions.filter(a => a.destinationId === selectedDestId);

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div>
        <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
          Exploração Espacial
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Mapa de Destinos & Rotas
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Conectando pontos de interesse, calculando distâncias e traçando circuitos turísticos
        </p>
      </div>

      {/* Componente de Mapa Interativo com Coordenadas Reais */}
      <InteractiveMap
        destinations={destinations}
        attractions={attractions}
        selectedDestinationId={selectedDestId}
        onSelectDestination={setSelectedDestId}
        onOpenAttraction={onOpenAttraction}
      />

      {/* Lista de Pontos Turísticos no Mapa Atual */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Pontos de Parada em {currentDest.city} ({destAttractions.length})
          </h3>
          <button
            onClick={() => onPlanTrip(currentDest.id)}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Planejar Viagem Aqui
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {destAttractions.map((attr, index) => (
            <div
              key={attr.id}
              onClick={() => onOpenAttraction(attr)}
              className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 cursor-pointer hover:border-teal-500/50 active:scale-[0.99] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {attr.name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    Lat: {attr.latitude.toFixed(3)}, Lng: {attr.longitude.toFixed(3)}
                  </div>
                </div>
              </div>

              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums shrink-0">
                {attr.estimatedCost > 0 ? `R$ ${attr.estimatedCost}` : 'Grátis'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
