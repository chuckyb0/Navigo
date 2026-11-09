/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapPin, Calendar, Users, DollarSign, Clock, Car, CheckCircle2, Circle, Navigation, Share2, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { Trip, ItineraryItem, Destination } from '../types';

interface ItineraryScreenProps {
  trip: Trip | null;
  allTrips: Trip[];
  onSelectTrip: (trip: Trip) => void;
  onOpenNewTrip: () => void;
  onOpenMap: () => void;
  onToggleItemCompleted: (tripId: number, dayNumber: number, itemId: number) => void;
  onSelectAttractionById?: (attractionId: number) => void;
}

export const ItineraryScreen: React.FC<ItineraryScreenProps> = ({
  trip,
  allTrips,
  onSelectTrip,
  onOpenNewTrip,
  onOpenMap,
  onToggleItemCompleted,
  onSelectAttractionById
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [copiedShare, setCopiedShare] = useState(false);

  if (!trip || !trip.itineraryDays || trip.itineraryDays.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center">
          <Calendar className="w-8 h-8 stroke-[1.8]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Nenhuma viagem criada ainda
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Planeje sua primeira experiência turística e o Navigo montará seu roteiro dia a dia automaticamente.
          </p>
        </div>
        <button
          onClick={onOpenNewTrip}
          className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow-md shadow-teal-600/20 active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Minha Primeira Viagem</span>
        </button>
      </div>
    );
  }

  const days = trip.itineraryDays;
  const currentDay = days[selectedDayIndex] || days[0];

  // Métricas do Roteiro
  const totalItems = days.reduce((acc, d) => acc + d.items.length, 0);
  const completedItems = days.reduce(
    (acc, d) => acc + d.items.filter(i => i.completed).length,
    0
  );
  const totalCost = days.reduce(
    (acc, d) => acc + d.items.reduce((s, i) => s + (i.estimatedCost || 0), 0),
    0
  );

  // Estimativa de distância média por dia (em km)
  const estimatedDayKm = (currentDay.items.length * 3.5).toFixed(1);
  const estimatedDayTravelTimeMin = currentDay.items.length * 15;

  const handleShare = () => {
    const text = `Meu roteiro para ${trip.destination?.name || 'minha viagem'} no Navigo! De ${trip.startDate} a ${trip.endDate} com ${days.length} dias planejados.`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return '☕';
      case 'lunch': return '🍽️';
      case 'dinner': return '🍷';
      case 'leisure': return '🌅';
      case 'activity': return '🧗';
      default: return '📍';
    }
  };

  return (
    <div className="space-y-5 pb-24">
      {/* 1. Header do Itinerário com Seletor de Viagem se houver múltiplas */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
        {allTrips.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold shrink-0">Suas Viagens:</span>
            {allTrips.map(t => (
              <button
                key={t.id}
                onClick={() => onSelectTrip(t)}
                className={`px-3 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                  t.id === trip.id 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {t.destination?.city || t.title}
              </button>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 mb-1">
              Roteiro de Viagem
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {trip.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-teal-600" />
                {trip.destination?.city}, {trip.destination?.state || trip.destination?.country}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {trip.startDate} — {trip.endDate}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                {trip.travelers} {trip.travelers === 1 ? 'viajante' : 'viajantes'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all text-xs flex items-center gap-1.5"
              title="Compartilhar Roteiro"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
              <span>{copiedShare ? 'Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              onClick={onOpenMap}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Ver no Mapa</span>
            </button>
          </div>
        </div>

        {/* Barra de Progresso e Métricas de Gastos */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Duração</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
              {days.length} {days.length === 1 ? 'Dia' : 'Dias'}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Gastos Estimados</div>
            <div className="text-sm font-bold text-teal-600 dark:text-teal-400 tabular-nums">
              R$ {totalCost.toLocaleString('pt-BR')}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Locais Visitados</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
              {completedItems} de {totalItems}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Perfil & Estilo</div>
            <div className="text-sm font-bold text-slate-900 dark:text-white capitalize">
              {trip.travelProfile} · {trip.budgetRange}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Seletor de Dias em Abas Horizontais Deslizantes */}
      <section className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Cronograma Diário</span>
          <span className="text-[11px] font-normal text-slate-400">
            Dia {selectedDayIndex + 1} de {days.length}
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {days.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            const completedCount = day.items.filter(i => i.completed).length;

            return (
              <button
                key={day.id}
                onClick={() => setSelectedDayIndex(idx)}
                className={`min-w-[105px] p-2.5 rounded-2xl border text-left transition-all active:scale-95 ${
                  isSelected
                    ? 'border-teal-600 bg-teal-600 text-white shadow-sm shadow-teal-600/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  Dia {day.dayNumber}
                </div>
                <div className={`text-[11px] ${isSelected ? 'text-teal-100' : 'text-slate-400'} tabular-nums`}>
                  {day.date}
                </div>
                <div className={`text-[10px] mt-1 ${isSelected ? 'text-teal-200' : 'text-slate-400'}`}>
                  {completedCount}/{day.items.length} concluídos
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Resumo de Transporte e Deslocamento do Dia */}
      <section className="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/50 flex flex-wrap items-center justify-between gap-3 text-xs text-teal-900 dark:text-teal-200">
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            Deslocamento estimado do Dia {currentDay.dayNumber}: <strong>~{estimatedDayKm} km</strong>
          </span>
        </div>
        <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>Tempo em trânsito: ~{estimatedDayTravelTimeMin} min (Uber / Táxi / Carro)</span>
        </div>
      </section>

      {/* 4. Timeline das Atividades do Dia Selecionado */}
      <section className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Itinerário: Dia {currentDay.dayNumber} — {currentDay.date}
        </h3>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {currentDay.items.map((item, idx) => {
            const isCompleted = !!item.completed;

            return (
              <div 
                key={item.id}
                className={`relative group bg-white dark:bg-slate-900 rounded-2xl border transition-all p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCompleted 
                    ? 'border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/20 dark:bg-emerald-950/10' 
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-teal-500/50'
                }`}
              >
                {/* Marcador na Linha do Tempo */}
                <div 
                  onClick={() => onToggleItemCompleted(trip.id, currentDay.dayNumber, item.id)}
                  className={`absolute -left-[27px] top-4.5 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-transform active:scale-90 ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white shadow-xs' 
                      : 'bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-slate-400 group-hover:border-teal-500'
                  }`}
                  title={isCompleted ? 'Marcar como não visitado' : 'Marcar como visitado'}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500">{idx + 1}</span>
                  )}
                </div>

                {/* Conteúdo da Atividade */}
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-teal-600 dark:text-teal-400 tabular-nums">
                      {item.timeSlot}
                    </span>
                    <span className="text-xs">{getItemIcon(item.itemType)}</span>
                    <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                      {item.itemType}
                    </span>
                  </div>

                  <h4 className={`text-base font-bold tracking-tight leading-snug ${
                    isCompleted 
                      ? 'line-through text-slate-400 dark:text-slate-500' 
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {item.customTitle}
                  </h4>

                  {item.notes && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {item.notes}
                    </p>
                  )}
                </div>

                {/* Custo e Ações */}
                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 block">Estimativa</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                      {item.estimatedCost > 0 ? `R$ ${item.estimatedCost}` : 'Grátis'}
                    </span>
                  </div>

                  <button
                    onClick={() => onToggleItemCompleted(trip.id, currentDay.dayNumber, item.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                      isCompleted 
                        ? 'bg-emerald-100 dark:bg-emerald-950 border-emerald-300 text-emerald-800 dark:text-emerald-300' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {isCompleted ? '✓ Visitado' : 'Marcar Concluído'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
